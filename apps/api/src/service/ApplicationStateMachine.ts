import {  ApplicationStates, ApplicationStateValues } from "@pcgl-daco/data-model/src/types.js";

// Function to check if a transition is valid from one state to another
export const canTransitionTo = (
    currentState: ApplicationStateValues,
    targetState: ApplicationStateValues
  ): boolean => {
    const validTransitions: Record<ApplicationStateValues, ApplicationStateValues[]> = {
      [ApplicationStates.DRAFT]: [ApplicationStates.INSTITUTIONAL_REP_REVIEW],
      [ApplicationStates.INSTITUTIONAL_REP_REVIEW]: [ApplicationStates.REP_REVISION, ApplicationStates.REJECTED],
      [ApplicationStates.REP_REVISION]: [ApplicationStates.DAC_REVIEW],
      [ApplicationStates.DAC_REVIEW]: [ApplicationStates.DAC_REVISIONS_REQUESTED, ApplicationStates.APPROVED],
      [ApplicationStates.DAC_REVISIONS_REQUESTED]: [ApplicationStates.DAC_REVIEW],
      [ApplicationStates.REJECTED]: [],
      [ApplicationStates.APPROVED]: [ApplicationStates.CLOSED, ApplicationStates.REVOKED],
      [ApplicationStates.CLOSED]: [],
      [ApplicationStates.REVOKED]: [],
    };
  
    // Check if the transition from currentState to targetState is valid
    return validTransitions[currentState]?.includes(targetState) || false;
  };
  