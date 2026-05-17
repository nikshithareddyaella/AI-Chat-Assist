const MAX_MESSAGE_LENGTH = 4000;

export function validateMessage(message: string): string | null {
  const trimmed = message.trim();

  if (!trimmed) {
    return "Please enter a message before sending.";
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }

  return null;
}
