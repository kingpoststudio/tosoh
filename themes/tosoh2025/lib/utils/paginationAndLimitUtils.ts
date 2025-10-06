import { RESET_PAGINATION_AND_FETCH_DATA_EVENT } from './constants';

export const resetPaginationAndFetchDataEvent = () => {
  window.dispatchEvent(
    new CustomEvent(RESET_PAGINATION_AND_FETCH_DATA_EVENT, {
      detail: {},
      bubbles: true,
    })
  );
};
