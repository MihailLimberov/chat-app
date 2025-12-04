"use client";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { log } from "console";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";



export const DeleteServerModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteServer";
    const server = data?.server;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/servers/${server?.id}`);
            onClose();
            router.refresh();
            router.push("/");
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure to delete server? <br />
                        <span className="text-red-500 font-semibold">{server?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading}
                            onClick={onClose}
                            variant="ghost">
                            Cancel
                        </Button>
                        <Button disabled={isLoading}
                            variant="primary"
                            onClick={onClick}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
};