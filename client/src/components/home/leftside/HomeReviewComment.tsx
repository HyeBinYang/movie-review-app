import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./Comment.css";
import axios from "axios";

import { Link } from "react-router-dom";
import { RootStateOrAny, useSelector } from "react-redux";
import { Comment } from "../../../models/model";

interface IProps {
  reviewId: number;
  comments: Comment[];
  comment: Comment;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  getCreated: (param: string | undefined) => string | undefined;
}

function HomeReviewComment({ reviewId, comments, comment, setComments, getCreated }: IProps) {
  const userName = useSelector((state: RootStateOrAny) => state.auth.userName);
  const [commentLikeToggle, setCommentLikeToggle] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState(0);

  useEffect(() => {
    if (comment.commentLikeUsers.filter((user) => user.username === userName).length) setCommentLikeToggle(true);
    setCommentLikeCount(comment.commentLikeUsers.length);
  }, []);

  const deleteComment = useCallback(() => {
    axios
      .delete(`/comment/${reviewId}/delete/${comment.id}`)
      .then(() => {
        const newComments = comments.filter((c) => c.id !== comment.id);
        setComments(newComments);
      })
      .catch((err) => console.log(err));
  }, []);

  const onHandleLike = useCallback(() => {
    axios
      .post(`/comment/${reviewId}/like/${comment.id}`, { userName })
      .then(() => {
        commentLikeToggle ? setCommentLikeCount(commentLikeCount - 1) : setCommentLikeCount(commentLikeCount + 1);
        setCommentLikeToggle(!commentLikeToggle);
      })
      .catch((err) => console.log(err));
  }, [commentLikeToggle, commentLikeCount]);

  const commentCreated = useMemo(() => getCreated(comment.created), []);

  return (
    <div className="comments__comment">
      <div className="comment__description">
        <Link to={`/user/${comment.username}`}>
          <b>{comment.username}</b>
        </Link>
        {comment.content}
        <div className="comment__info">
          <span>{commentCreated}</span>
          <span>
            좋아요 <b>{commentLikeCount}</b>개
          </span>
        </div>
      </div>
      <div className="comment__icon">
        {commentLikeToggle ? (
          <i onClick={onHandleLike} className="fas fa-heart" style={{ color: "red" }}></i>
        ) : (
          <i onClick={onHandleLike} className="far fa-heart"></i>
        )}
        {comment.username === userName ? (
          <>
            <i onClick={deleteComment} className="fas fa-trash-alt"></i>
            <i className="fas fa-edit"></i>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(HomeReviewComment);
