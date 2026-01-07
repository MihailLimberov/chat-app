"use client";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import qs from "query-string";
import { useRouter } from "next/navigation";



export const DeleteMessageModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    //const params = useParams();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteMessage";
    const apiUrl = data?.apiUrl;
    const query = data?.query;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query: query,
            })

            await axios.delete(url);
            onClose();
            //router.refresh();
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
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure to delete message? <br />
                        The massage will be permanently deleted
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