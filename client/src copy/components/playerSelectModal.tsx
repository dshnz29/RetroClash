"use client"

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

interface Player {
    id: string;
    username: string;
    email: string;
}

interface PlayerSelectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    players: Player[]; // list of online players to select from
    onSelect: (player: Player | null) => void; // pass selected player or null if none selected
}

export default function PlayerSelectModal({ open, onOpenChange, players, onSelect }: PlayerSelectModalProps) {
    const [selectedPlayerId, setSelectedPlayerId] = React.useState<string | null>(null);

    const handleSelect = () => {
        const player = players.find(p => p.id === selectedPlayerId) || null;
        onSelect(player);
        onOpenChange(false);
    };
    console.log(players);
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">Select Player</Dialog.Title>
                    <Dialog.Description className="DialogDescription">
                        Please select an online player to challenge.
                    </Dialog.Description>

                    <div style={{ maxHeight: 200, overflowY: "auto", marginTop: 20 }}>
                        {players.length === 0 && <p>No players online.</p>}
                        {players.map((player) => (
                            <label
                                key={player.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 10,
                                    cursor: "pointer",
                                    backgroundColor: selectedPlayerId === player.id ? "#22c55e33" : "transparent",
                                    padding: "5px 10px",
                                    borderRadius: 5,
                                }}
                            >
                                <input
                                    type="radio"
                                    name="player"
                                    value={player.id}
                                    checked={selectedPlayerId === player.id}
                                    onChange={() => setSelectedPlayerId(player.id)}
                                    style={{ marginRight: 10 }}
                                />
                                {player.username}
                            </label>
                        ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 25 }}>
                        <button
                            className="Button red"
                            onClick={() => {
                                onSelect(null);
                                onOpenChange(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="Button green"
                            disabled={!selectedPlayerId}
                            onClick={handleSelect}
                            style={{ marginLeft: 10 }}
                        >
                            Select
                        </button>
                    </div>

                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close" style={{ position: "absolute", top: 10, right: 10 }}>
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
