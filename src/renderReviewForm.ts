import { reviewStarsSelect, reviewTextarea } from "./main"

/**
 * Update the review form to match the review data given
 */

export default function renderReviewForm(reviewData: { stars: number, text: string }) {
    reviewStarsSelect.value = reviewData.stars.toString()
    reviewTextarea.value = reviewData.text
}
