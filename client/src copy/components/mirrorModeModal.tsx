"use client"

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

interface MirrorModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (enabled: boolean) => void;
}

export default function MirrorModeDialog({ open, onOpenChange, onSelect }: MirrorModeDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Mirror Mode</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Do you want to enable mirror mode?
          </Dialog.Description>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 25 }}>
            <button
              className="Button red"
              onClick={() => {
                onSelect(false);
                onOpenChange(false);
              }}
            >
              No
            </button>
            <button
              className="Button green"
              onClick={() => {
                onSelect(true);
                onOpenChange(false);
              }}
            >
              Yes
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
