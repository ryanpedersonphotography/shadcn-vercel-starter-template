import config from "@payload-config";
import { getPayload } from "payload";

/**
 * Get a cached Payload instance
 * This ensures we don't create multiple instances in development
 */
export const getPayloadClient = async () => {
  return getPayload({ config });
};