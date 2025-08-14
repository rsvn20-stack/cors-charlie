import { google } from "googleapis";

const SPREADSHEET_ID = "1FCQIFncNOuOgJm6j0wephwgUjPXAUIXIvMXSgb6y7y4";
const SHEET_NAME = "Sheet7";

// Setup Google API auth client
async function getSheetsClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
  } catch (error) {
    console.error("Error in getSheetsClient:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "Error", message: "Method not allowed" });
  }

  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ status: "Error", message: "Data harus berupa array" });
    }

    const sheets = await getSheetsClient();

    // Prepare rows untuk append
    const rows = data.map((row) => [
      row.id || "",
      row.accName || "",
      row.accHolder || "",
      row.accNo || "",
      row.bankGroup || "",
    ]);

    // Append rows ke sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: rows,  // pastikan 'rows' lowercase
      },
    });

    return res.status(200).json({ status: "Success" });
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ status: "Error", message: error.message });
  }
}
