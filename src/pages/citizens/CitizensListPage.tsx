import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";
import MaterialIcon from "../../assets/icons/MaterialIcon";

import {
    decodeWardId,
    getDistrictById,
    getLocalLevelById,
    getProvinceById,
    NepalDistrictSelect,
    NepalLocalSelect,
    NepalProvinceSelect,
    NepalWardSelect,
} from "@itzsa/nepal-geo";

import axiosInstance from "../../config/axios.config";
import type { CitizensApiResponse, CitizenType, DisplayCitizen } from "./types/Citizen.types";
import { LinkButton } from "../../components/ui/Link";
import { DataTable } from "../../components/table/data-table";
import { citizenColumn } from "../../components/citizens/CitizenTableColumn";



const normalizeCitizen = (item: CitizenType): DisplayCitizen => {
    const province = item.province_id ? getProvinceById(item.province_id)?.nameEn ?? "" : "";
    const district = item.district_id ? getDistrictById(item.district_id)?.nameEn ?? "" : "";
    const municipality = item.local_id ? getLocalLevelById(item.local_id)?.nameEn ?? "" : "";
    const wardNo = decodeWardId(item.ward_id).number ?? 0;

    return {
        id: item.id ?? "",
        name: item.name ?? "",
        phone: item.phone ?? "",
        dob: item.dob ?? undefined,
        address: {
            province,
            district,
            municipality,
            wardNo,
        },
        father: {
            name: item.father_name ?? undefined,
            contact: item.father_phone ?? undefined,
        },
        mother: {
            name: item.mother_name ?? undefined,
            contact: item.mother_phone ?? undefined,
        }
    };
};




export default function CitizenListPage() {
    const { data: citizens = [] } = useQuery({
        queryKey: ["citizens"],
        queryFn: async (): Promise<DisplayCitizen[]> => {
            const response = (await axiosInstance.get("/citizens/all")) as CitizensApiResponse | CitizenType[] | null;
            const list = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : [];

            return list.map(normalizeCitizen);
        },
    });

    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [localId, setLocalId] = useState<number | null>(null);
    const [wardId, setWardId] = useState<number | null>(null);

    const [page, setPage] = useState(1);

    const limit = 10;

    const selectedProvinceName = provinceId ? getProvinceById(provinceId)?.nameEn ?? "" : "";
    const selectedDistrictName = districtId ? getDistrictById(districtId)?.nameEn ?? "" : "";
    const selectedLocalName = localId ? getLocalLevelById(localId)?.nameEn ?? "" : "";
    const selectedWardNumber = wardId ? decodeWardId(wardId).number : null;

    const filteredCitizens = useMemo(() => {
        return citizens.filter((citizen) => {

            const matchesProvince =
                !provinceId ||
                citizen.address.province.toLowerCase() === selectedProvinceName.toLowerCase();

            const matchesDistrict =
                !districtId ||
                citizen.address.district.toLowerCase() === selectedDistrictName.toLowerCase();

            const matchesMunicipality =
                !localId ||
                citizen.address.municipality.toLowerCase() === selectedLocalName.toLowerCase();

            const matchesWard =
                !wardId ||
                citizen.address.wardNo.toString() === selectedWardNumber?.toString();

            return (
                matchesProvince &&
                matchesDistrict &&
                matchesMunicipality &&
                matchesWard
            );
        });
    }, [
        provinceId,
        districtId,
        localId,
        wardId,
        selectedProvinceName,
        selectedDistrictName,
        selectedLocalName,
        selectedWardNumber,
    ]);

    const paginatedCitizens = filteredCitizens.slice(
        (page - 1) * limit,
        page * limit
    );

    const clearFilters = () => {
        setProvinceId(null);
        setDistrictId(null);
        setLocalId(null);
        setWardId(null);
        setPage(1);
    };

    const hasFilters =
        provinceId !== null ||
        districtId !== null ||
        localId !== null ||
        wardId !== null;

    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Citizens
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and view collected citizen information.
                    </p>
                </div>

                <div className="flex gap-2">
                    <LinkButton
                        to="/citizens/add"
                        title="Add"
                        icon="person_add"
                    />
                    <LinkButton to="/citizens/import" title="Import" icon="upload_file" />
                </div>

            </div>


            {/* FILTER CARD */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <CardTitle className="text-base">
                            Filters
                        </CardTitle>

                        {hasFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                            >
                                <MaterialIcon
                                    icon="close"
                                    className="text-base!"
                                />

                                Clear filters
                            </Button>
                        )}

                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="space-y-1">
                            <NepalProvinceSelect
                                label="Province"
                                value={provinceId}
                                onChange={(value) => {
                                    setProvinceId(value);
                                    setDistrictId(null);
                                    setLocalId(null);
                                    setWardId(null);
                                    setPage(1);
                                }}
                                clearable
                            />
                        </div>

                        <div className="space-y-1">
                            <NepalDistrictSelect
                                provinceId={provinceId}
                                label="District"
                                value={districtId}
                                onChange={(value) => {
                                    setDistrictId(value);
                                    setLocalId(null);
                                    setWardId(null);
                                    setPage(1);
                                }}
                                disabled={!provinceId}
                                clearable
                            />
                        </div>

                        <div className="space-y-1">
                            <NepalLocalSelect
                                districtId={districtId}
                                label="Municipality"
                                value={localId}
                                onChange={(value) => {
                                    setLocalId(value);
                                    setWardId(null);
                                    setPage(1);
                                }}
                                disabled={!districtId}
                                clearable
                            />
                        </div>

                        <div className="space-y-1">
                            <NepalWardSelect
                                localId={localId}
                                label="Ward"
                                value={wardId}
                                onChange={(value) => {
                                    setWardId(value);
                                    setPage(1);
                                }}
                                disabled={!localId}
                                clearable
                            />
                        </div>

                    </div>
                </CardContent>
            </Card>


            {/* CITIZEN TABLE */}
            <Card>
                <CardContent>
                    <DataTable columns={citizenColumn} data={paginatedCitizens} />
                </CardContent>
            </Card>

        </div>
    );
}

