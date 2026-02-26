import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

let grok: OpenAI | null = null;
const getGrok = () => {
  if (!grok)
    grok = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
    });
  return grok;
};

type ContentType =
  | "listing_description"
  | "social_instagram"
  | "social_facebook"
  | "social_twitter"
  | "email_campaign"
  | "sms_blast"
  | "video_script"
  | "ad_copy";

const buildPropertyPrompt = (
  contentType: ContentType,
  tone: string,
  data: Record<string, unknown>
) => {
  const toneInstruction = `Write in a ${tone} tone.`;
  const property = `
  Address: ${data.address}, ${data.city}, ${data.state} ${data.zipCode}
  Price: $${Number(data.price).toLocaleString()}
  Type: ${data.propertyType}
  Beds: ${data.bedrooms} | Baths: ${data.bathrooms} | Sq Ft: ${Number(data.squareFeet).toLocaleString()}
  ${data.yearBuilt ? `Year Built: ${data.yearBuilt}` : ""}
  Features: ${Array.isArray(data.features) ? data.features.join(", ") : ""}
  ${data.description ? `Notes: ${data.description}` : ""}
  `.trim();

  const prompts: Record<ContentType, string> = {
    listing_description: `You are a real estate copywriter. ${toneInstruction} Write a compelling MLS listing description for this property. 3–4 sentences, no bullet points, highlight the best features.\n\n${property}`,
    social_instagram: `You are a real estate social media expert. ${toneInstruction} Write a punchy Instagram caption for this listing. Include 5–8 relevant hashtags at the end. Keep it under 150 words.\n\n${property}`,
    social_facebook: `You are a real estate marketing expert. ${toneInstruction} Write an engaging Facebook post for this listing. 2–3 paragraphs, conversational, end with a call-to-action.\n\n${property}`,
    social_twitter: `You are a real estate social media expert. ${toneInstruction} Write a Twitter/X post for this listing. Must be under 280 characters. Include price and key stat.\n\n${property}`,
    email_campaign: `You are a real estate email marketer. ${toneInstruction} Write a property spotlight email. Include: subject line, short intro, property highlights in bullets, and a CTA. Keep it under 200 words.\n\n${property}`,
    sms_blast: `You are a real estate marketer. Write a short SMS message about this property. Max 160 characters. Include price and address.\n\n${property}`,
    video_script: `You are a real estate video script writer. ${toneInstruction} Write a 60-second video walkthrough script for this property. Include an intro hook, room-by-room highlights, and a closing CTA.\n\n${property}`,
    ad_copy: `You are a real estate ad copywriter. ${toneInstruction} Write Google/Facebook ad copy for this property. Headline (max 30 chars), Description line 1 (max 90 chars), Description line 2 (max 90 chars).\n\n${property}`,
  };

  return prompts[contentType];
};

const buildVehiclePrompt = (
  contentType: ContentType,
  tone: string,
  data: Record<string, unknown>
) => {
  const toneInstruction = `Write in a ${tone} tone.`;
  const vehicle = `
  ${data.year} ${data.make} ${data.model}${data.trim ? ` ${data.trim}` : ""}
  Price: $${Number(data.price).toLocaleString()}
  Condition: ${data.condition}
  Mileage: ${Number(data.mileage).toLocaleString()} miles
  ${data.color ? `Exterior: ${data.color}` : ""}
  ${data.transmission ? `Transmission: ${data.transmission}` : ""}
  ${data.engine ? `Engine: ${data.engine}` : ""}
  ${data.fuelType ? `Fuel: ${data.fuelType}` : ""}
  Features: ${Array.isArray(data.features) ? data.features.join(", ") : ""}
  ${data.description ? `Notes: ${data.description}` : ""}
  `.trim();

  const prompts: Record<ContentType, string> = {
    listing_description: `You are an automotive copywriter. ${toneInstruction} Write a compelling vehicle listing description. 3–4 sentences, highlight key specs and appeal.\n\n${vehicle}`,
    social_instagram: `You are an automotive social media expert. ${toneInstruction} Write a punchy Instagram caption for this vehicle. Include 5–8 relevant hashtags. Under 150 words.\n\n${vehicle}`,
    social_facebook: `You are an automotive marketing expert. ${toneInstruction} Write an engaging Facebook post for this vehicle. 2–3 paragraphs, conversational, end with a CTA.\n\n${vehicle}`,
    social_twitter: `You are an automotive social media expert. ${toneInstruction} Write a Twitter/X post for this vehicle. Max 280 characters. Include price and key stat.\n\n${vehicle}`,
    email_campaign: `You are an automotive email marketer. ${toneInstruction} Write a vehicle spotlight email. Include: subject line, highlights in bullets, and a CTA. Under 200 words.\n\n${vehicle}`,
    sms_blast: `You are an automotive marketer. Write a short SMS about this vehicle. Max 160 characters. Include price and model.\n\n${vehicle}`,
    video_script: `You are an automotive video script writer. ${toneInstruction} Write a 60-second walkaround video script. Include intro hook, feature highlights, and closing CTA.\n\n${vehicle}`,
    ad_copy: `You are an automotive ad copywriter. ${toneInstruction} Write Google/Facebook ad copy. Headline (max 30 chars), Description line 1 (max 90 chars), Description line 2 (max 90 chars).\n\n${vehicle}`,
  };

  return prompts[contentType];
};

export const POST = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    sourceType,
    contentType,
    tone = "professional",
    data,
  }: {
    sourceType: "property" | "vehicle";
    contentType: ContentType;
    tone: string;
    data: Record<string, unknown>;
  } = body;

  if (!sourceType || !contentType || !data) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const prompt =
    sourceType === "property"
      ? buildPropertyPrompt(contentType, tone, data)
      : buildVehiclePrompt(contentType, tone, data);

  const startTime = Date.now();

  const completion = await getGrok().chat.completions.create({
    model: "grok-3-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.75,
    max_tokens: 600,
  });

  const durationMs = Date.now() - startTime;
  const message = completion.choices[0].message.content ?? "";
  const usage = completion.usage;

  return NextResponse.json({
    body: message,
    usage: {
      promptTokens: usage?.prompt_tokens ?? 0,
      completionTokens: usage?.completion_tokens ?? 0,
      totalTokens: usage?.total_tokens ?? 0,
    },
    durationMs,
  });
};
