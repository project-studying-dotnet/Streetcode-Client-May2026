import { makeAutoObservable } from "mobx";

type ModalState = {
<<<<<<< chore/108/Admin-Art-gallery-block
    isOpen: boolean;
    fromCardId?: number;
    confirmationProps?:ConfirmationProps;
    image?: any;
    data?: any;
=======
  isOpen: boolean;
  fromCardId?: number;
  confirmationProps?: ConfirmationProps;
>>>>>>> dev
};

interface ConfirmationProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  text?: string;
}

const DefaultModalState: ModalState = {
<<<<<<< chore/108/Admin-Art-gallery-block
    isOpen: false,
    fromCardId: undefined,
    confirmationProps: undefined,
    image: undefined,
};

interface ModalList {
    relatedFigures: ModalState;
    relatedFigureItem: ModalState;
    sources: ModalState;
    facts: ModalState;
    audio: ModalState;
    donates: ModalState;
    login: ModalState;
    artGallery: ModalState;
    partners: ModalState;
    tagsList: ModalState;
    addTerm: ModalState;
    editTerm: ModalState;
    deleteTerm: ModalState;
    deleteStreetcode: ModalState;
    confirmation: ModalState;
    adminFacts: ModalState;
    adminChronology: ModalState;
    statistics: ModalState;
    editImage: ModalState;
    deleteImage: ModalState;
    deleteImageTemplates: ModalState;
    templates: ModalState;
=======
  isOpen: false,
  fromCardId: undefined,
  confirmationProps: undefined,
};

interface ModalList {
  relatedFigures: ModalState;
  relatedFigureItem: ModalState;
  sources: ModalState;
  facts: ModalState;
  audio: ModalState;
  donates: ModalState;
  login: ModalState;
  artGallery: ModalState;
  partners: ModalState;
  tagsList: ModalState;
  addTerm: ModalState;
  editTerm: ModalState;
  deleteTerm: ModalState;
  deleteStreetcode: ModalState;
  confirmation: ModalState;
  adminFacts: ModalState;
  adminChronology: ModalState;
  statistics: ModalState;
>>>>>>> dev
}

export default class ModalStore {
    public modalsState: ModalList = {
        relatedFigures: DefaultModalState,
        relatedFigureItem: DefaultModalState,
        sources: DefaultModalState,
        facts: DefaultModalState,
        audio: DefaultModalState,
        donates: DefaultModalState,
        login: DefaultModalState,
        artGallery: DefaultModalState,
        partners: DefaultModalState,
        tagsList: DefaultModalState,
        addTerm: DefaultModalState,
        editTerm: DefaultModalState,
        deleteTerm: DefaultModalState,
        deleteStreetcode: DefaultModalState,
        confirmation: DefaultModalState,
        adminFacts: DefaultModalState,
        adminChronology: DefaultModalState,
        statistics: DefaultModalState,
        editImage: DefaultModalState,
        deleteImage: DefaultModalState,
        deleteImageTemplates: DefaultModalState,
        templates: DefaultModalState,
    };

  public isPageDimmed = false;

  public constructor() {
    makeAutoObservable(this);
  }

  public setIsPageDimmed = (dimmed?: boolean) => {
    this.isPageDimmed = dimmed ?? !this.isPageDimmed;
  };

<<<<<<< chore/108/Admin-Art-gallery-block
    public setModal = (modalName: keyof ModalList, fromId?: number, opened?: boolean, data?: any) => {
        this.modalsState[modalName] = {
            isOpen: opened ?? !this.modalsState[modalName].isOpen,
            fromCardId: fromId,
            image: data,
        };
=======
  public setModal = (
    modalName: keyof ModalList,
    fromId?: number,
    opened?: boolean,
  ) => {
    this.modalsState[modalName] = {
      isOpen: opened ?? !this.modalsState[modalName].isOpen,
      fromCardId: fromId,
>>>>>>> dev
    };
  };

  public setConfirmationModal = (
    modalName: keyof ModalList,
    onSubmit?: () => void,
    text?: string,
    opened?: boolean,
    onCancel?: () => void,
  ) => {
    this.modalsState[modalName] = {
      isOpen: opened ?? !this.modalsState[modalName].isOpen,
      confirmationProps: { onSubmit, text, onCancel },
    };
  };
}
