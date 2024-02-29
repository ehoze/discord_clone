"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";

import { useModal } from "@/hooks/use-modal-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);

        }, 1000);
    }

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen("invite", { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Zaproś znajomych!
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-500">
                        Po wysłaniu zaproszenia do znajomych będziecie razem mogli rozmawiać i czatować na tym serwerze :D
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-slate-500 dark:text-secondary/90">
                        Link zaproszenia
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-slate-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl} />
                        <Button disabled={isLoading} size="icon">
                            {copied
                                ? <Check className="w-4 h-4" />
                                : <Copy onClick={onCopy} className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Button
                        disabled={isLoading}
                        onClick={onNew}
                        variant="link"
                        size="sm"
                        className="text-xs text-slate-500 mt-4">
                        Wygeneruj nowy link zaproszenia
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}