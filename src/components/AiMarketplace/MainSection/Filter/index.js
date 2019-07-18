import React from "react";
import { connect } from "react-redux";

import StyledExpansionPanel from "./StyledExpansionPanel";
import { useStylesHook } from "./styles";
import { serviceActions } from "../../../../Redux/actionCreators";
import {
  filterParamters,
  defaultPaginationParameters,
  generateFilterObject,
} from "../../../../utility/constants/Pagination";

const Filter = ({
  activeFilterItem,
  pagination,
  updatePagination,
  fetchService,
  filterDataProps,
  handleFilterChange,
  resetFilter,
}) => {
  const classes = useStylesHook();
  const filterData = {};
  Object.entries(filterDataProps).map(([key, items]) => {
    filterData[key] = { title: key, name: key, items };
  });

  const handleActiveFilterItemChange = async event => {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    const currentFilterItem = [...activeFilterItem[name]];
    if (!currentFilterItem.includes(value)) {
      currentFilterItem.push(value);
    } else {
      currentFilterItem.splice(currentFilterItem.findIndex(el => el === value), 1);
    }
    const currentActiveFilterData = { ...activeFilterItem, [name]: currentFilterItem };
    const filterObj = generateFilterObject(currentActiveFilterData);
    const latestPagination = { ...pagination, ...defaultPaginationParameters, s: filterParamters[name], q: value };
    handleFilterChange({ pagination: latestPagination, filterObj, currentActiveFilterData });
  };

  const handleFilterReset = async () => {
    const latestPagination = { ...pagination, ...defaultPaginationParameters, s: filterParamters.all, q: "" };
    resetFilter({ pagination: latestPagination });
  };

  return (
    <div className={classes.filterContainer}>
      <div className={classes.filterResetBtnContainer}>
        <h2 className={classes.h2}>Filters</h2>
        <button className={classes.resetBtn} type="reset" value="Reset" onClick={handleFilterReset}>
          Reset
        </button>
      </div>
      <StyledExpansionPanel
        expansionItems={Object.values(filterData)}
        handleChange={handleActiveFilterItemChange}
        activeFilterItem={activeFilterItem}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  activeFilterItem: state.serviceReducer.activeFilterItem,
  pagination: state.serviceReducer.pagination,
  filterDataProps: state.serviceReducer.filterData,
});

const mapDispatchToProps = dispatch => ({
  updatePagination: pagination => dispatch(serviceActions.updatePagination(pagination)),
  fetchService: (pagination, filterObj) => dispatch(serviceActions.fetchService(pagination, filterObj)),
  handleFilterChange: args => dispatch(serviceActions.handleFilterChange({ ...args })),
  resetFilter: args => dispatch(serviceActions.resetFilter({ ...args })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);