import '../../styles/global-styles.css';

import { Component } from 'react';

import { loadPosts } from '../../utils/load-posts'
import { Posts } from '../../component/Posts'
import { Button } from '../../component/Button';
import { TextInput } from '../../component/TextInput';

export class Home extends Component {

  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 10,
    searchValue: ''
  }

  async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state;

    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,
    })
  }

  loadMorePosts = () => {
    const {
      page,
      postsPerPage,
      allPosts,
      posts
    } = this.state;

    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);

    posts.push(...nextPosts);

    this.setState({ posts, page: nextPage });
  }

  handleTimeOut = () => {
    const { posts } = this.state;
    posts[0].title = 'O titulo mudou';

    this.timeoutUpdate = setTimeout(() => {
      this.setState({ posts });
    }, 5000);
  }

  handleChange = (e) => {
    const { value } = e.target;

    this.setState({ searchValue: value });
  }

  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filteredPosts = !!searchValue ?
      allPosts.filter(post => {
        return post.title.toLowerCase().includes(
          searchValue.toLowerCase()
        );
      })
      : posts;

    return (
      <section className="container">
        <div className='search-container'>
          {!!searchValue && (
            <h1>Search Value = {searchValue}</h1>
          )}

          <TextInput
            searchValue={searchValue}
            handleChange={this.handleChange} />
        </div>


        {filteredPosts.length > 0 && (
          <Posts posts={filteredPosts} />
        )}

        {filteredPosts.length === 0 && (
          <p>Não existem posts</p>
        )}

        <div className="button-container">
          {!searchValue && (<Button
            text='load more posts'
            onClick={this.loadMorePosts}
            disabled={noMorePosts} />)}

        </div>
      </section >
    );
  }
}
