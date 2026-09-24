export const SSO_STATE_COOKIE = "sso_state"

const ACCESS_TOKEN_MAX_AGE = 60 * 60
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60
const STATE_MAX_AGE = 5 * 60

const isProduction = process.env.NODE_ENV === "production"

type CookieOptions = {
    httpOnly: true
    sameSite: "lax"
    secure: boolean
    path: string
    maxAge: number
}

function baseOptions(maxAge: number): CookieOptions {
    return { httpOnly: true, sameSite: "lax", secure: isProduction, path: "/", maxAge }
}

export const stateCookieOptions = () => baseOptions(STATE_MAX_AGE)
export const accessTokenCookieOptions = () => baseOptions(ACCESS_TOKEN_MAX_AGE)
export const refreshTokenCookieOptions = () => baseOptions(REFRESH_TOKEN_MAX_AGE)
