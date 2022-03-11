const copy = async (text: string): Promise<boolean> => {
  try {
    await globalThis.navigator.clipboard.writeText(text);
    return true;
  } catch (e: unknown) {
    return false;
  }
};

export { copy };
