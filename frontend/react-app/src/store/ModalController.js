
class ModalController {

    modalIsVisible = false;

    setVisible (modalIsVisible) {
        this.modalIsVisible = modalIsVisible;
    }

    isVisible () {
        return this.modalIsVisible;
    }
}

export default new ModalController();