import {
  Component,
  OnInit,
  SecurityContext
} from '@angular/core';
import * as Quill from 'quill';
import 'quill-mention';
import 'quill-emoji';
import { QuillInitializeService } from './quill-initialization.service';
import { CommonService } from '../shared/common.service';
import { Post } from './post.model';
import moment from 'moment';
import tippy from 'tippy.js';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../users/user.model';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  hasFocus = false;
  htmlText = '';
  posts: Post[] = [];

  searchBasedOnUsername = [];
  searchBasedOnNumber = [];

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean'], // remove formatting button

        ['link'],
        // ['link', 'image', 'video']
        ['emoji']
      ],
      handlers: { emoji: function() {} }
    },
    autoLink: false,
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@', '#'],
      source: (searchTerm, renderList, mentionChar) => {
        let values;

        if (mentionChar === '@') {
          values = this.searchBasedOnUsername;
        } else if (mentionChar === '#') {
          values = this.searchBasedOnNumber;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++) {
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            ) {
              matches.push(values[i]);
            }
          }
          renderList(matches, searchTerm);
        }
      }
    },
    'emoji-toolbar': true,
    'emoji-textarea': true,
    'emoji-shortname': true,
  };
  constructor(
    private quillInitializationService: QuillInitializeService,
    private commonService: CommonService,
    public san: DomSanitizer
  ) {
    this.commonService.posts.subscribe(posts => {
      this.posts = posts;
    });
  }

  ngOnInit() {
    this.commonService.users.subscribe(users => {
      this.searchBasedOnUsername = users.slice().map( u =>  {
        const userSearch = {
          'id': u.id,
          'value': u.name
        };
        return userSearch;
      });

      this.searchBasedOnNumber = users.slice().map( u =>  {
        const userSearch = {
          'id': u.id,
          'value': u.number
        };
        return userSearch;
      });
    });

    this.searchBasedOnNumber = this.commonService.users.value.slice().map( u =>  {
      const userSearch = {
        'id': u.id,
        'value': u.number
      };
      return userSearch;
    });
  }

  addPost() {
    const post: Post = {
      id: (this.posts.length ? this.posts.length : 0) + 1,
      text: this.san.bypassSecurityTrustHtml(this.htmlText),
      createdAt: new Date(),
      isBeingEdited: false
    };
    this.htmlText = '';
    this.posts.unshift(post);
    this.commonService.posts.next(this.posts);
  }

  getDate(d: Date) {
    return moment(d).fromNow();
  }

  hoverEvent(data) {
    if (data.target.className === 'mention' && data.target.dataset.denotationChar === '@') {
      const userData: User = this.commonService.getUserById(data.target.dataset.id);
      tippy(data.target, { content: this.showUserDetails(userData), delay: 100,
        arrow: true,
        arrowType: 'round',
        size: 'large',
        duration: 500,
        animation: 'scale' });
    } else if (data.target.className === 'mention' && data.target.dataset.denotationChar === '#') {
      const userData: User = this.commonService.getUserById(data.target.dataset.id);
      tippy(data.target, { content: this.showUserDetails(userData), delay: 100,
        arrow: true,
        arrowType: 'round',
        size: 'large',
        duration: 500,
        animation: 'scale' });
    }
  }

  showUserDetails(user: User) {
    const data = `
    <ul style="list-style:none; text-align: left; padding: 0px; font-family: lato">
    <li><i style="vertical-align:middle; padding-right: 8px;" class="material-icons">face</i>${user.id}</li>
    <li><i style="vertical-align:middle; margin-right: 8px;" class="material-icons">alternate_email</i>${user.username}</li>
    <li><i style="vertical-align:middle; margin-right: 8px;" class="material-icons">perm_identity</i>${user.name}</li>
    <li><i style="vertical-align:middle; margin-right: 8px;" class="material-icons">call</i>${user.number}</li>
    <li><i style="vertical-align:middle; margin-right: 8px;" class="material-icons">next_week</i>${user.role}</li>
    </ul>
    `;
    return data;
  }

  getContent(data) {
    return this.san.bypassSecurityTrustHtml(data.toString());
  }

  editPostInitialization(post: Post) {
    post.isBeingEdited = true;
    post.text = this.san.sanitize(SecurityContext.HTML, post.text);
  }

  editPostDone(post: Post) {
    post.isBeingEdited = false;
    post.text = this.san.bypassSecurityTrustHtml(post.text.toString());
    this.commonService.posts.next(this.posts);
  }
}
