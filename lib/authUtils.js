import { getToken } from "next-auth/jwt";

export default class AuthUtils {
  static secret = process.env.NEXTAUTH_SECRET;

  /**
   * Get the authenticated user's token
   * @param {Object} req - Next.js request object
   * @returns {Promise<Object|null>} - Decoded token or null
   */
  static async getToken(req) {
    try {
      return await getToken({ req, secret: this.secret });
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Get the user ID from the token
   * @param {Object} req - Next.js request object
   * @returns {Promise<string|null>} - User ID or null
   */
  static async getUserId(req) {
    const token = await this.getToken(req);
    return token?.id || null;
  }

  /**
   * Get the user role from the token
   * @param {Object} req - Next.js request object
   * @returns {Promise<string|null>} - User role or null
   */
  static async getUserRole(req) {
    const token = await this.getToken(req);
    return token?.role || null;
  }

  /**
   * Get both user ID and role from the token
   * @param {Object} req - Next.js request object
   * @returns {Promise<{id: string, role: string}|null>} - User info or null
   */
  static async getUserInfo(req) {
    const token = await this.getToken(req);
    if (!token) return null;
    return {
      id: token.id,
      role: token.role,
    };
  }

  /**
   * Check if user has a specific role
   * @param {Object} req - Next.js request object
   * @param {string} requiredRole - Role to check against
   * @returns {Promise<boolean>} - Whether user has the required role
   */
  static async hasRole(req, requiredRole) {
    const role = await this.getUserRole(req);
    return role === requiredRole;
  }

  /**
   * Validate the request has an authenticated user
   * @param {Object} req - Next.js request object
   * @returns {Promise<{isValid: boolean, userInfo: {id: string, role: string}|null, errorResponse: Response|null}>}
   */
  static async validateRequest(req) {
    const userInfo = await this.getUserInfo(req);

    if (!userInfo) {
      return {
        isValid: false,
        userInfo: null,
        errorResponse: new NextResponse(
          JSON.stringify({ message: "Authorization token is required" }),
          { status: 401 }
        ),
      };
    }

    return {
      isValid: true,
      userInfo,
      errorResponse: null,
    };
  }
}
