export class TokenUtil {
  static extractTokenFromHeader(
    request: Request | Record<string, any>,
  ): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
