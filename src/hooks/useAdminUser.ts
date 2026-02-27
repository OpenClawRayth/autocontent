"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useRef } from "react";

export const ADMIN_USER_ID = "admin_bypass";

export const useAdminUser = () => {
  const { user, isLoaded } = useUser();
  const upsertAdmin = useMutation(api.users.upsertAdmin);
  const seeded = useRef(false);

  const isAdmin = isLoaded && !user;

  useEffect(() => {
    if (isAdmin && !seeded.current) {
      seeded.current = true;
      upsertAdmin({}).catch(() => {});
    }
  }, [isAdmin, upsertAdmin]);

  return {
    userId: isAdmin ? ADMIN_USER_ID : (user?.id ?? ""),
    isAdmin,
    isLoaded,
    user,
  };
};
