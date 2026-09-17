import type {
  DesignThinkingStatus,
  EmpathizeData,
  DefineData,
  IdeateData,
  PrototypeData,
  TestData,
} from "@/types";

type AnyStageData = EmpathizeData | DefineData | IdeateData | PrototypeData | TestData;

function filled(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}

function hasNonEmptyEntry(list: string[] | undefined): boolean {
  return !!list && list.some((v) => filled(v));
}

/**
 * Whether a stage's documentation is actually complete enough to advance,
 * not just "an object exists" (idea creation seeds a couple of Empathize
 * fields from the submission form, which used to make a barely-started
 * stage register as "done" and skip straight past the "Complete
 * documentation to advance" warning into an unexpected multi-field gate).
 */
export function isStageDataComplete(
  status: DesignThinkingStatus,
  data: AnyStageData | undefined
): boolean {
  if (!data) return false;

  switch (status) {
    case "Empathize": {
      const d = data as EmpathizeData;
      return (
        filled(d.what) &&
        filled(d.when) &&
        filled(d.where) &&
        filled(d.who) &&
        filled(d.how) &&
        hasNonEmptyEntry(d.whys) &&
        filled(d.rootCause)
      );
    }
    case "Define": {
      const d = data as DefineData;
      return (
        filled(d.problemStatement) &&
        filled(d.userPersona) &&
        filled(d.needStatement) &&
        hasNonEmptyEntry(d.insights)
      );
    }
    case "Ideate": {
      const d = data as IdeateData;
      return (
        hasNonEmptyEntry(d.brainstormIdeas) &&
        filled(d.selectedIdea) &&
        filled(d.selectionReason)
      );
    }
    case "Prototype": {
      const d = data as PrototypeData;
      return hasNonEmptyEntry(d.toolsRequired) && hasNonEmptyEntry(d.steps);
    }
    case "Test": {
      const d = data as TestData;
      return filled(d.testPlan) && filled(d.results) && typeof d.passed === "boolean";
    }
    default:
      return false;
  }
}
