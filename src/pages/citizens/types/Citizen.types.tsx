import * as z from "zod";

const phonePattern = /^\d{7,15}$/;

export const CreateCitizenDTO = z.object({
    // Citizen
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(150, "Name cannot exceed 150 characters.")
        .nonempty("Name is required."),

    phone: z
        .string()
        .trim()
        .regex(phonePattern, "Phone number must contain 7 to 15 digits.")
        .nonempty("Phone number is required."),

    dob: z
        .string()
        .optional()
        .nullable()
        .refine(
            (value) => {
                if (!value) return true;

                const date = new Date(value);
                const today = new Date();

                return !isNaN(date.getTime()) && date <= today;
            },
            {
                message: "Date of birth cannot be in the future.",
            }
        ),

    // Address
    // province_id: z
    //     .number({
    //         message: "Province is required.",
    //     })
    //     .int("Province ID must be a valid number.")
    //     .positive("Province ID must be a positive number."),

    // district_id: z
    //     .number({
    //         message: "District is required.",
    //     })
    //     .int("District ID must be a valid number.")
    //     .positive("District ID must be a positive number."),

    // local_id: z
    //     .number({
    //         message: "Municipality is required.",
    //     })
    //     .int("Municipality ID must be a valid number.")
    //     .positive("Municipality ID must be a positive number."),

    // ward_id: z
    //     .number({
    //         message: "Ward is required.",
    //     })
    //     .int("Ward ID must be a valid number.")
    //     .positive("Ward ID must be a positive number."),

    // Father
    father_name: z
        .string()
        .trim()
        .min(2, "Father's name must be at least 2 characters.")
        .max(150, "Father's name cannot exceed 150 characters.")
        .optional()
        .nullable()
        .or(z.literal("")),

    father_phone: z
        .string()
        .trim()
        .regex(
            phonePattern,
            "Father's phone number must contain 7 to 15 digits."
        )
        .optional()
        .nullable()
        .or(z.literal("")),

    // Mother
    mother_name: z
        .string()
        .trim()
        .min(2, "Mother's name must be at least 2 characters.")
        .max(150, "Mother's name cannot exceed 150 characters.")
        .optional()
        .nullable()
        .or(z.literal("")),

    mother_phone: z
        .string()
        .trim()
        .regex(
            phonePattern,
            "Mother's phone number must contain 7 to 15 digits."
        )
        .optional()
        .nullable()
        .or(z.literal("")),
});

export type CreateCitizenFormType = z.infer<typeof CreateCitizenDTO>;


export interface CitizenType {
    id?: string;
    name?: string;
    phone?: string;
    dob?: string | null;
    province_id: number;
    district_id: number;
    local_id: number;
    ward_id: number;
    father_name?: string | null;
    father_phone?: string | null;
    mother_name?: string | null;
    mother_phone?: string | null;
}

export interface CitizensApiResponse {
    data: CitizenType[];
    message?: string;
    status?: string;
}

export interface DisplayCitizen {
    id: string;
    name: string;
    phone: string;
    dob?: string;
    address: {
        province: string;
        district: string;
        municipality: string;
        wardNo: number;
    };
    father: {
        name?: string;
        contact?: string;
    }
    mother: {
        name?: string;
        contact?: string;
    };
}