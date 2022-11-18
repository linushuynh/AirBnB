import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css"
import { getSpotById } from "../../store/spots";
import { createReview, deleteReview, editReview, loadReviews } from "../../store/review";

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.spotById);
    const reviews = useSelector((state) => state.reviewState.reviews)
    const history = useHistory();
    const [showReviewMenu, setShowReviewMenu] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [stars, setStars] = useState(0);
    const [loadAfterSubmit, setLoadAfterSubmit] = useState(false);
    const [errors, setErrors] = useState([]);
    const currentUser = useSelector(state => state.session.user);
    const [selectEditForm, setSelectEditForm] = useState(0)

    const openReviewMenu = () => {
        if (showReviewMenu) return
        setShowReviewMenu(true)
    }

    const closeReviewMenu = () => {
        if (!showReviewMenu) return;
        setShowReviewMenu(false);
    };

    useEffect(() => {
        dispatch(getSpotById(spotId));
        dispatch(loadReviews(spotId));
        setLoadAfterSubmit(false);
    }, [spotId, loadAfterSubmit, dispatch, errors])

    const submitReview = (e) => {
        e.preventDefault();

        dispatch(createReview({
            review: reviewText,
            stars
        }, spotId));

        setReviewText("");
        setStars(0);
        setErrors([]);
        closeReviewMenu();
        setLoadAfterSubmit(true);
    }

    const clickDeleteReview = (e, reviewId) => {
        e.preventDefault();

        dispatch(deleteReview(reviewId))
        setErrors([]);
        setReviewText("")
        setStars(0);
        setShowReviewMenu(false);
        setLoadAfterSubmit(true);
    }

    const clickEditReview = (e, reviewId) => {
        e.preventDefault();

        dispatch(editReview({
            review: reviewText,
            stars
        }, reviewId))

        setErrors([]);
        setReviewText("")
        setStars(0);
        setShowEditForm(false)
        setLoadAfterSubmit(true);
    }

    if (!spot) return null

    return (
        <>
            <div id="center-container">
                <div id="spot-detail-container">
                    <p id="spot-name">{spot.name}</p>
                    <p>{spot.city}, {spot.country}</p>
                    {spot.SpotImages.map((spotImg) => (
                        <div className="img-container" key={spotImg.id}>
                            <img src={spotImg.url} alt={spotImg.address} className='spot-img' />
                        </div>
                    ))}
                    <p>{spot.description}</p>
                    <div id="avgRating">
                        <p>★{spot.avgRating} · {spot.numReviews} review(s)</p>
                    </div>
                    {reviews.map((review) => (
                        <div className="review-item" key={review.id}>
                            <div>{review.User.firstName} {review.User.lastName}</div>
                            <div>{review.createdAt}</div>
                            {review.review}
                            {showEditForm ? (
                                <div className="edit-container">
                                    <button className="edit-button" onClick={() => {
                                        if (!showEditForm) return
                                        setShowEditForm(false);
                                        setReviewText("");
                                        setStars(0);
                                    }}>Cancel Edit</button>
                                    <form onSubmit={(e) => clickEditReview(e, review.id)}>
                                        <label>
                                        <textarea
                                        onChange={(e) => setReviewText(e.target.value) }
                                        value={reviewText}
                                        placeholder="Tell us your thoughts"
                                        />
                                        </label>
                                        <br />
                                        <label>
                                            Stars:
                                            <input
                                            type="number"
                                            min="0"
                                            max="5"
                                            placeholder="0-5★"
                                            onChange={(e) => setStars(e.target.value)}
                                            value={stars}
                                            />
                                        </label>
                                        <br />
                                        <button type="submit">Submit Edit</button>
                                    </form>
                                </div>
                            )
                            :
                            (
                                <div className="edit-container">
                                    <button className="edit-button" onClick={() => {
                                        if (showEditForm) return
                                        setShowEditForm(true)
                                        setReviewText(review.review);
                                        setStars(review.stars);
                                    }}>Edit</button>
                                </div>
                            )}
                            <br />
                            <div id="delete-button-container">
                                 <button onClick={(e) => clickDeleteReview(e, review.id)}>Delete review</button>
                            </div>
                            <br />
                        </div>
                    ))}
                    <br />
                    <div id="create-review-box">
                        {!showReviewMenu ? (
                            <button onClick={openReviewMenu}>Create a new review</button>
                            )
                            :
                            (<div>
                        <button onClick={closeReviewMenu}>Cancel review</button>
                        <form onSubmit={submitReview} id="review-menu">
                            <label>
                                <br />
                                <textarea
                                onChange={(e) => setReviewText(e.target.value) }
                                value={reviewText}
                                placeholder="Tell us your thoughts"
                                />
                            </label>
                            <br />
                            <label>
                                Stars:
                                <input
                                type="number"
                                min="0"
                                max="5"
                                placeholder="0-5★"
                                onChange={(e) => setStars(e.target.value)}
                                value={stars}
                                />
                            </label>
                            <br />
                            <button type="submit">Submit review</button>
                        </form>
                        </div>)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SpotDetails;
