
import { IResponseHandler } from "@interfaces";
import { format } from "date-fns";

class Helpers {

    static responseHandler(code: number, message: string, data?: unknown, error?: string): IResponseHandler {
        return {
            code,
            message,
            data,
            error,
        };
    }

    static calculateTokenExpiry(tokenFor: string): number {
        let duration: number;
        let unit: string | undefined;

        if (tokenFor.trim() === "a") {
            duration = parseInt(process.env.ACCESS_TOKEN_DURATION || "0", 10);
            unit = process.env.ACCESS_TOKEN_UNIT;
        } else if (tokenFor.trim() === "r") {
            duration = parseInt(process.env.REFRESH_TOKEN_DURATION || "0", 10);
            unit = process.env.REFRESH_TOKEN_UNIT;
        } else {
            throw new Error('Invalid token type. Use "a" for access token or "r" for refresh token.');
        }

        if (isNaN(duration) || duration <= 0) {
            throw new Error('Invalid token duration. Ensure environment variables are set and valid.');
        }

        if (!unit) {
            throw new Error('Token unit is undefined. Set ACCESS_TOKEN_UNIT or REFRESH_TOKEN_UNIT in environment variables.');
        }

        // Convert duration into seconds based on unit
        switch (unit.toLowerCase()) {
            case 'minutes':
                return duration * 60; // minutes to seconds
            case 'hours':
                return duration * 60 * 60; // hours to seconds
            case 'days':
                return duration * 24 * 60 * 60; // days to seconds
            case 'weeks':
                return duration * 7 * 24 * 60 * 60; // weeks to seconds
            case 'months':
                return duration * 30 * 24 * 60 * 60; // months to seconds (approx)
            default:
                throw new Error('Invalid unit. Use "minutes", "hours", "days", "weeks", or "months".');
        }
    }

    static convertSecondsToDate(seconds: number) {
        const expirationTimestamp = Math.floor(Date.now() / 1000) + seconds;
        const date = new Date(expirationTimestamp * 1000);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    }
    static getCurrentSQLTimestamp() {
        return new Date().toISOString().slice(0, 19).replace("T", " ");
    }
}

export default Helpers 