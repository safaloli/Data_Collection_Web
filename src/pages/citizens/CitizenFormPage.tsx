import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
    CardContent,
} from "../../components/ui/card";

import CitizenForm from "../../components/citizens/AddCitizenForm";

export default function CitizenFormPage() {
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const navigate = useNavigate();


    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex items-center gap-3">

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/citizens/list")}
                >
                    <ArrowLeft />
                </Button>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {isEditMode ? "Edit Citizen" : "Add Citizen"}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        {isEditMode ? "Update" : "Add a new"} citizen to the database.
                    </p>
                </div>

            </div>

            <CardContent>
                <CitizenForm />
            </CardContent>

        </div>
    );
}