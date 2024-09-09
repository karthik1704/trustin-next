//Prod

export const SERVER_API_URL = "https://libkesapi.vimkes.com";
export const PDF_URL = "https://libkes.vimkes.com"

// //Local

// export const SERVER_API_URL = "http://localhost:8000";
// export const PDF_URL = "http://localhost:3000";


export type StandardKey = 'IS' | 'ISO' | 'EN' | 'ASTM' | 'AATCC' | 'BP' | 'IP' | 'USP';

type Standards = {
    [key in StandardKey]: string;
};

export const standards:Standards = {
    IS: "Indian Standard",
    ISO: "International Organization for Standardization",
    EN: "European Standards",
    ASTM: "American Society for Testing and Materials",
    AATCC: "American Association of Textile Chemists and Colorists",
    BP: "British Pharmacopoeia",
    IP: "Indian Pharmacopoeia",
    USP: "United States Pharmacopeia"
};

export const logo = "/images/logo/logo.png";