import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    NepalDistrictSelect,
    NepalLocalSelect,
    NepalProvinceSelect,
    NepalWardSelect,
} from "@itzsa/nepal-geo";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import MaterialIcon from "../../assets/icons/MaterialIcon";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import axiosInstance from "../../config/axios.config";
import { CreateCitizenDTO, type CitizenType, type CreateCitizenFormType } from "../../pages/citizens/types/Citizen.types";



export default function CitizenForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);
    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [localId, setLocalId] = useState<number | null>(null);
    const [wardId, setWardId] = useState<number | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CreateCitizenFormType>({
        resolver: zodResolver(CreateCitizenDTO),
        defaultValues: {
            name: "",
            phone: "",
            dob: "",
            father_name: "",
            father_phone: "",
            mother_name: "",
            mother_phone: "",
        },
    });

    const citizenQuery = useQuery({
        queryKey: ["citizen", id],
        queryFn: async (): Promise<CitizenType> => {
            const response = await axiosInstance.get(`/citizens/${id}`) as { data: CitizenType } | CitizenType;
            return "data" in response ? response.data : response;
        },
        enabled: isEditMode,
    });

    useEffect(() => {
        const citizen = citizenQuery.data;

        if (!citizen) return;

        reset({
            name: citizen.name ?? "",
            phone: citizen.phone ?? "",
            dob: citizen.dob ?? "",
            father_name: citizen.father_name ?? "",
            father_phone: citizen.father_phone ?? "",
            mother_name: citizen.mother_name ?? "",
            mother_phone: citizen.mother_phone ?? "",
        });
        setProvinceId(citizen.province_id);
        setDistrictId(citizen.district_id);
        setLocalId(citizen.local_id);
        setWardId(citizen.ward_id);
    }, [citizenQuery.data, reset]);

    const submitHandler = async (data: CreateCitizenFormType) => {
        if (!provinceId || !districtId || !localId || !wardId) {
            toast.error("Please select a complete address.");
            return;
        }

        const payload = {
            name: data.name.trim(),
            phone: data.phone.trim(),
            dob: data.dob || null,
            province_id: Number(provinceId),
            district_id: Number(districtId),
            local_id: Number(localId),
            ward_id: Number(wardId),
            father_name: data.father_name?.trim() || null,
            father_phone: data.father_phone?.trim() || null,
            mother_name: data.mother_name?.trim() || null,
            mother_phone: data.mother_phone?.trim() || null,
        };

        try {
            if (isEditMode) {
                await axiosInstance.patch(`/citizens/${id}`, payload);
            } else {
                await axiosInstance.post("/citizens", payload);
            }

            toast.success(isEditMode ? "Citizen updated successfully." : "Citizen added successfully.");
            await queryClient.invalidateQueries({ queryKey: ["citizens"] });
            navigate("/citizens/list");
        } catch (error: any) {
            const message = error?.message || error?.status || `Failed to ${isEditMode ? "update" : "add"} citizen.`;
            toast.error(message);
            console.log(error)
        }
    };

    if (isEditMode && citizenQuery.isLoading) {
        return <p className="text-sm text-muted-foreground">Loading citizen...</p>;
    }

    if (isEditMode && (citizenQuery.isError || !citizenQuery.data)) {
        return <p className="text-sm text-destructive">Unable to load citizen.</p>;
    }

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MaterialIcon icon="person" />
                        Personal Information
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Full Name <span className="text-destructive">*</span>
                        </label>
                        <Input name="name" control={control} placeholder="Enter citizen's full name" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Phone Number <span className="text-destructive">*</span>
                        </label>
                        <Input name="phone" control={control} type="tel" placeholder="98XXXXXXXX" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Date of Birth</label>
                        <Input name="dob" control={control} type="date" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MaterialIcon icon="location_on" />
                        Address
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Province</label>
                        <NepalProvinceSelect
                            value={provinceId}
                            onChange={(value) => {
                                setProvinceId(value);
                                setDistrictId(null);
                                setLocalId(null);
                                setWardId(null);
                            }}
                            clearable
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">District</label>
                        <NepalDistrictSelect
                            provinceId={provinceId}
                            value={districtId}
                            onChange={(value) => {
                                setDistrictId(value);
                                setLocalId(null);
                                setWardId(null);
                            }}
                            disabled={!provinceId}
                            clearable
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Municipality</label>
                        <NepalLocalSelect
                            districtId={districtId}
                            value={localId}
                            onChange={(value) => {
                                setLocalId(value);
                                setWardId(null);
                            }}
                            disabled={!districtId}
                            clearable
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ward</label>
                        <NepalWardSelect
                            localId={localId}
                            value={wardId}
                            onChange={setWardId}
                            disabled={!localId}
                            clearable
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MaterialIcon icon="man" />
                        Father's Information
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Father's Name</label>
                        <Input name="father_name" control={control} placeholder="Enter father's name" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Father's Phone</label>
                        <Input name="father_phone" control={control} type="tel" placeholder="98XXXXXXXX" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MaterialIcon icon="woman" />
                        Mother's Information
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mother's Name</label>
                        <Input name="mother_name" control={control} placeholder="Enter mother's name" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mother's Phone</label>
                        <Input name="mother_phone" control={control} type="tel" placeholder="98XXXXXXXX" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate("/citizens/list")}>
                    Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting} isSubmitting={isSubmitting}>
                    {isSubmitting ? "Saving" : "Save Citizen"}
                </Button>
            </div>
        </form>
    );
}