import React, {useEffect, useState} from 'react';
import css from './HeaderSearchBlock.module.scss';
import queryComponents from './queriesComponents';

const HeaderSearchBlock = () => {
    const [searchTypeList, setSearchTypeList] = useState(queryComponents);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [openedList, setOpenedList] = useState(false);
    const [resultOpened, setResultOpened] = useState(false);

    const toggleSearchTypeList = function () {
        setOpenedList(!openedList);
    }

    const toggleResultList = function () {
        setResultOpened(!resultOpened);
    }

    const setType = function ({ target }) {
        const type = target.getAttribute('type');
        setSearchType(type);
    }

    const inputHandler = function ({ target }) {
        setSearchQuery(target.value);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                window.dispatchEvent(new Event('init-search'));
                setResultOpened(true);
            } else {
                setResultOpened(false);
            }
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery, searchType])

    return (
        <div className={css.block}>
            <div className={css.searchTypeSelect} onClick={toggleSearchTypeList}>
                <div className={css.searchType}>
                    /{searchType}
                </div>
                <div className={[css.searchSelect, openedList?css.opened:''].join(' ')}>
                    {
                        searchTypeList.map((queryComponent) =>
                            <div
                                key={queryComponent.name}
                                className={css.searchOption}
                                type={queryComponent.name}
                                onClick={setType}
                            >
                                /{queryComponent.name}
                            </div>
                        )
                    }
                </div>
            </div>
            <div className={css.searchInput}>
                <input type={'text'} placeholder={'Поиск'} value={searchQuery} onInput={inputHandler}/>
            </div>
            <div className={css.searchButton} onClick={toggleResultList}>?</div>
            <div className={[css.searchResult, resultOpened?css.r_opened:''].join(' ')}>
                {
                    searchTypeList.filter((queryItem) =>
                        queryItem.name === searchType)[0].queriesComponents.map((QueryComponent) =>
                            <QueryComponent
                                key={QueryComponent.name}
                                query={searchQuery}
                            />
                        )
                }
            </div>
        </div>
    );
};

export default HeaderSearchBlock;