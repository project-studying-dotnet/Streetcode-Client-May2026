import { makeAutoObservable, runInAction } from "mobx";
import termsApi from "@api/streetcode/text-content/terms.api";
import { Term, TermCreate } from "@models/streetcode/text-contents.model";

export default class TermStore {
  public TermMap = new Map<number, Term>();

  public constructor() {
    makeAutoObservable(this);
  }

  public setInternalMap = (terms: Term[]) => {
    terms.forEach(this.setItem);
  };

  private setItem = (term: Term) => {
    this.TermMap.set(term.id, term);
  };

  get getTermArray() {
    return Array.from(this.TermMap.values());
  }

  public fetchTerms = async () => {
    try {
      const terms = await termsApi.getAll();
      this.setInternalMap(terms);
    } catch (error: unknown) {
      return null;
    }
  };

  public createTerm = async (term: TermCreate) => {
    let newData = null as unknown as Term;
    await termsApi.create(term).then((response) => {
      this.setItem(response);
      newData = response;
    });
    return newData;
  };

  public updateTerm = async (term: Term) => {
    let updatedData = null as unknown as Term;

    await termsApi.update(term).then((response) => {
      runInAction(() => {
        const currentTerm = this.TermMap.get(term.id);
        const mergedTerm = {
          ...currentTerm,
          ...response,
        };

        this.setItem(mergedTerm as Term);
        updatedData = mergedTerm as Term;
      });
    });

    return updatedData;
  };

  public deleteTerm = async (termId: number) => {
    if (termId !== 0) {
      await termsApi.delete(termId);
      runInAction(() => {
        this.TermMap.delete(termId);
      });
    }
  };
}
