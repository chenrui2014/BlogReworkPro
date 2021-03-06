/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';
import {Link} from 'react-router';

import config from '../../config';
import {getLocalUrl} from '../utils';
import Base from './base';
import Loading from './loading';
import NormalError from './normalError';
import Pagination from './pagination';

import '../theme/css/content-list.less';


export default class ArticleList extends Base {
    render() {
        const type = this.type;
        const store = this.props.store;
        const state = store.get('state');

        if (state === 'error') {
            return <NormalError key='normal-error' />;
        }
        if (state === 'wait') {
            return <Loading key='loading' />;
        }

        const currentList = store.get('currentList');
        const currentPage = store.get('currentPage');
        const currentName = !this.props.params.name ? '' : store.get('currentName');
        const maxPage = store.get('maxPage');
        const list = currentList.slice(
            currentPage * config.articlesPerPage, (currentPage + 1) * config.articlesPerPage
        );

        return (
            <div id="content-list">
                {this.renderTop()}
                <ul>
                    {list.map((item, index) => this.renderPage(item, index, list.size))}
                </ul>
                <Pagination
                    type={type}
                    color={this.props.theme.getIn(['current', 'tagColor'])}
                    name={currentName}
                    currentPage={currentPage}
                    maxPage={maxPage}
                />
            </div>
        );
    }

    renderTop() {}

    renderPage(item, index: number, size: number) {
        const background = this.props.theme.getIn(['current', 'tagColor']);

        return (
            <section key={index}>
                <Link
                    to={getLocalUrl('article', item.get('slug'))}
                    rel='bookmark'
                    title={item.getIn(['title', 'view'])}
                >
                    <h2 className="duration-main">
                        {item.getIn(['title', 'view'])}
                    </h2>
                </Link>
                <header>
                    <div className="top">
                        <p className="tag-sp authors">
                            <span className="duration-main" style={{background}}>少女</span>
                            {
                                item.get('authors').map((author, i) => (
                                    <Link
                                        key={i}
                                        className="duration-main"
                                        to={getLocalUrl('author', author.get('slug'), 0)}
                                    >
                                        {author.get('view')}
                                    </Link>
                                ))
                            }
                        </p>
                        <p className="tag-sp category">
                            <span className="duration-main" style={{background}}>世界</span>
                            <Link
                                className="duration-main"
                                to={getLocalUrl('category', item.getIn(['category', 'slug']), 0)}
                            >
                                {item.getIn(['category', 'view'])}
                            </Link>
                        </p>
                        <p className="tag-sp time">
                            <span className="duration-main" style={{background}}>时刻</span>
                            <a className="duration-main">
                                {item.get('date').split(' ')[0]}
                            </a>
                        </p>
                    </div>
                    <div className="tag-sp tags">
                        <span className="duration-main" style={{background}}>路标</span>
                        {
                            item.get('tags').map((tag, i) => (
                                <p key={i}>
                                    <Link
                                        className="duration-main"
                                        to={getLocalUrl('tag', tag.get('slug'), 0)}
                                    >
                                        {tag.get('view')}
                                    </Link>
                                </p>
                            ))
                        }
                    </div>
                </header>
                <summary dangerouslySetInnerHTML={{__html: item.get('summary')}} />
                <footer>
                    {
                        index === size - 1 ? null :
                            <div
                                className="hr duration-main"
                                style={{background}}
                            >
                            </div>
                    }
                </footer>
            </section>
        );
    }
}
