import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
    decodeWardId,
    getDistrictById,
    getLocalLevelById,
    getProvinceById,
} from "@itzsa/nepal-geo";

import axiosInstance from "../../config/axios.config";
import type { CitizenType } from "./types/Citizen.types";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { formatDate } from "../../utils/helpers";

export default function CitizenDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const citizenQuery = useQuery({
        queryKey: ["citizen", id],
        queryFn: async (): Promise<CitizenType> => {
            const response = await axiosInstance.get(`/citizens/${id}`) as { data: CitizenType } | CitizenType;
            return "data" in response ? response.data : response;
        },
        enabled: Boolean(id),
    });

    useEffect(() => {
        if (citizenQuery.isError) {
            toast.error("Unable to load citizen details.");
        }
    }, [citizenQuery.isError]);

    if (citizenQuery.isLoading) {
        return <p className="text-sm text-muted-foreground">Loading citizen...</p>;
    }

    if (citizenQuery.isError || !citizenQuery.data) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => navigate("/citizens/list")}>
                    <ArrowLeft />
                    Back to citizens
                </Button>
                <p className="text-sm text-destructive">Citizen record could not be found.</p>
            </div>
        );
    }

    const citizen = citizenQuery.data;
    const province = getProvinceById(citizen.province_id)?.nameEn ?? "";
    const district = getDistrictById(citizen.district_id)?.nameEn ?? "";
    const municipality = getLocalLevelById(citizen.local_id)?.nameEn ?? "";
    const ward = decodeWardId(citizen.ward_id).number ?? "";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/citizens/list")}>
                        <ArrowLeft />
                        <span className="sr-only">Back to citizens</span>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{citizen.name}</h1>
                        <p className="text-sm text-muted-foreground">Citizen ID: {citizen.id}</p>
                    </div>
                </div>
                <Button onClick={() => navigate(`/citizens/edit/${citizen.id}`)}>
                    <Pencil />
                    Edit citizen
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle className="text-base">Personal information</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Detail label="Name" value={citizen.name} />
                        <Detail label="Phone" value={citizen.phone} />
                        <Detail label="Date of birth" value={formatDate(citizen.dob)} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Address</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Detail label="Province" value={province} />
                        <Detail label="District" value={district} />
                        <Detail label="Municipality" value={municipality} />
                        <Detail label="Ward" value={String(ward)} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Family information</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Detail label="Father" value={citizen.father_name} />
                        <Detail label="Father phone" value={citizen.father_phone} />
                        <Detail label="Mother" value={citizen.mother_name} />
                        <Detail label="Mother phone" value={citizen.mother_phone} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-medium">{value || "Not provided"}</dd>
        </div>
    );
}
