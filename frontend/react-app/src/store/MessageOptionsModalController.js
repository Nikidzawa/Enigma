import {makeAutoObservable} from "mobx";
import MessageDto from "../api/internal/dto/MessageDto";

class MessageOptionsModalController {
    isOpen = false;
    isEditMode = false;
    selectedMessageEntity = new MessageDto();
    selectedMessageCoordinates = {x: 0, y: 0};

    constructor() {
        makeAutoObservable(this);
    }

    setIsOpen(isOpen) {
        this.isOpen = isOpen;
    }

    getIsOpen() {
        return this.isOpen;
    }

    setIsEditMode(isEditMode) {
        this.isEditMode = isEditMode;
    }

    getIsEditMode() {
        return this.isEditMode;
    }

    setSelectedMessageEntity(selectedMessageEntity) {
        this.selectedMessageEntity = selectedMessageEntity;
    }

    getSelectedMessageEntity() {
        return this.selectedMessageEntity;
    }

    setSelectedMessageCoordinates(selectedMessageCoordinates) {
        this.selectedMessageCoordinates = selectedMessageCoordinates;
    }

    getSelectedMessageCoordinates() {
        return this.selectedMessageCoordinates;
    }

    closeAndClearData () {
        this.isOpen = false;
        this.isEditMode = false;
    }

    stopEdit() {
        this.isOpen = false;
        this.isEditMode = false;
        this.selectedMessageEntity = new MessageDto();
        this.selectedMessageCoordinates = {x: 0, y: 0};
    }
}

export default new MessageOptionsModalController();