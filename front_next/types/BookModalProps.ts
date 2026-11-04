import { Book } from "./Book";

export interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
}
