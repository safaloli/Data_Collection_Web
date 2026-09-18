import NepaliDate from "nepali-date-converter";

export function formatDate(date?: string | null) {
    if (!date) return "—";

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) return date;

    const nepaliDate = new NepaliDate(new Date(`${date}T00:00:00Z`)).getBS();
    return `${String(nepaliDate.month + 1).padStart(2, "0")}/${String(nepaliDate.date).padStart(2, "0")}/${nepaliDate.year}`;
}

export function toDateInputValue(date?: string | null) {
    if (!date) return "";

    return formatDate(date);
}