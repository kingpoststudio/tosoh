export const resetPaginationAndLimitAndFetchDataEvent = () => {
  window.dispatchEvent(
    new CustomEvent('TosohPaginationWithLimitResetAndFetchData', {
      detail: {},
      bubbles: true,
    })
  );
};
