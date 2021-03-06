import React from 'react';
import { History } from 'history';
import { stringify } from 'query-string';
import { ErrorBoundary, FilterType } from '@osu-cass/sb-components';

import { SearchBar } from '../SearchBar';
import { IClaim } from '../../models/claim';
import { Styles } from '../../constants/style';
import { ErrorMessage, Message } from '../Message';
import { FilterItemList } from '../FilterItemList';
import { IFilterClient } from '../../clients/filter';
import { ISearchClient } from '../../clients/search';
import { FilterComponent } from '../FilterComponent';
import { CSEFilterOptions, CSEFilterParams, CSESearchQuery } from '../../models/filter';

export interface SearchPageProps {
  paramsFromUrl: CSESearchQuery;
  filterClient: IFilterClient;
  searchClient: ISearchClient;
  history: History;
}

export interface SearchPageState {
  params: CSEFilterParams;
  results?: IClaim[] | Error;
  options?: CSEFilterOptions | Error;
  search: string;
  pt: boolean;
}

function shouldShowFilter(urlParams: CSESearchQuery): boolean {
  return urlParams.filter ? true : false;
}

function anyParams(params: CSEFilterParams, search: string) {
  return search || params.grades.length || params.claim || params.subject || params.target;
}

function unwrapError<T>(data?: T | Error): T | undefined {
  if (!data) {
    return undefined;
  }

  return data instanceof Error ? undefined : data;
}

function compareParams(oldParams: CSEFilterParams, newParams: CSEFilterParams): FilterType {
  if (JSON.stringify(oldParams.grades) !== JSON.stringify(newParams.grades)) {
    return FilterType.Grade;
  }
  if (oldParams.subject !== newParams.subject) {
    return FilterType.Subject;
  }
  if (oldParams.claim !== newParams.claim) {
    return FilterType.Claim;
  }

  return FilterType.Target;
}

const placeholder = (targetCode: string) => `/target/${targetCode}`;

/**
 * Search page react component. Handles text searching and filtering
 *
 * @export
 * @class SearchPage
 * @extends {React.Component<SearchPageProps, SearchPageState>}
 */
export class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);

    this.state = {
      params: {
        grades: props.paramsFromUrl.grades || [],
        subject: props.paramsFromUrl.subject,
        claim: props.paramsFromUrl.claim,
        target: props.paramsFromUrl.target,
        filter: props.paramsFromUrl.filter
      },
      search: props.paramsFromUrl.search || '',
      pt: false
    };
  }

  async componentDidMount() {
    const { params, search } = this.state;
    const options = await this.props.filterClient.getFilterOptions(params);
    let results: IClaim[] | Error | undefined;
    if (anyParams(params, search)) {
      results = await this.props.searchClient.search({ search, ...params });
    }
    this.setState({ options, results });
  }

  private updateQuery(search: string, params: CSEFilterParams) {
    const query: CSESearchQuery = {
      search,
      ...params
    };
    const queryString = stringify(query);
    this.props.history.replace({ search: queryString });
  }

  updateSearch = async (filter: CSEFilterParams) => {
    let results = await this.props.searchClient.search({ search: this.state.search, ...filter });
    if (this.state.pt) {
      results = this.filterPerformanceTasks(results as IClaim[]);
    }

    this.setState({ results });
  };

  onFilterChanged = async (newFilter: CSEFilterParams) => {
    const { params, search } = this.state;
    // tslint:disable-next-line:prefer-const
    let options = await this.props.filterClient.getFilterOptions(
      newFilter,
      compareParams(params, newFilter),
      unwrapError(this.state.options)
    );

    this.updateQuery(search, newFilter);
    this.setState({ options, params: newFilter }, async () => this.updateSearch(newFilter));
  };

  onSearch = async (search: string) => {
    let results = await this.props.searchClient.search({ search, ...this.state.params });

    if (this.state.pt) {
      results = this.filterPerformanceTasks(results as IClaim[]);
    }

    this.updateQuery(search, this.state.params);
    this.setState({ results, search });
  };

  renderFilter() {
    const { params, options } = this.state;
    const errorJsx = <ErrorMessage>Error loading filter options</ErrorMessage>;
    if (!options) {
      return <Message>Loading filter options...</Message>;
    }
    if (options instanceof Error) {
      return errorJsx;
    }

    return (
      <ErrorBoundary fallbackUI={errorJsx}>
        <FilterComponent
          options={options}
          params={params}
          onUpdate={this.onFilterChanged}
          expanded={shouldShowFilter(this.state.params)}
          filterPT={this.togglePerformanceTask}
        />
      </ErrorBoundary>
    );
  }

  togglePerformanceTask = async () => {
    const { params } = this.state;
    this.setState({
      pt: !this.state.pt
    });
    await this.onFilterChanged(params);
  };

  filterPerformanceTasks = (claims: IClaim[]): IClaim[] => {
    const results: IClaim[] = [];
    claims.forEach(c => {
      c.target = c.target.filter(t => t.interactionType === 'PT');
      if (c.target.length > 0) {
        results.push(c);
      }
    });

    return results;
  };

  renderNarrowText(results: IClaim[]) {
    let resultCount = 0;
    results.forEach(r => (resultCount = resultCount + r.target.length));

    return (
      <div>
        {resultCount > 10 ? (
          <div id="narrow-results">
            <i>Use filter to narrow search results</i>
            <style jsx>{`
              #narrow-results {
                color: #cc0000;
              }
            `}</style>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  renderResults() {
    const { results } = this.state;
    const errorJsx = <ErrorMessage>Error fetching results from the server</ErrorMessage>;
    if (!results) {
      return <Message>Enter a query to see matching targets.</Message>;
    }
    if (results instanceof Error) {
      return errorJsx;
    }
    if (results.length === 0) {
      return <Message>No results found.</Message>;
    }

    return (
      <ErrorBoundary fallbackUI={errorJsx}>
        {this.renderNarrowText(results)}
        <div aria-live="polite">
          <FilterItemList claims={results} getTargetLink={placeholder} />
        </div>
      </ErrorBoundary>
    );
  }

  render() {
    return (
      <React.Fragment>
        <SearchBar onSearch={this.onSearch} initialText={this.props.paramsFromUrl.search} />
        <div className="content-container">
          {this.renderFilter()}
          <div>{this.renderResults()}</div>
        </div>
        <style jsx>{`
          .content-container {
            margin: ${Styles.paddingUnit} 0;
          }
        `}</style>
      </React.Fragment>
    );
  }
}
