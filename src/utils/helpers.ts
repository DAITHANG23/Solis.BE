export const accessTokenExtractor = (req: any): string | null => {
  if (!req) return null;

  const authHeader = req.headers?.authorization;
  if (authHeader?.startsWith('Bearer')) {
    return authHeader.split(' ')[1];
  }

  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};
