import "bootstrap/dist/css/bootstrap.min.css"
import { deleteReview, putReview, postReview, fetchAllReviews } from "./api"
import renderReviewForm from "./renderReviewForm"

export type Review = {
  id: number
  author: string
  text: string
  stars: number
  movieId: number
}

/**** STATE ****/

export let reviewList: Review[] = []
export let reviewToEditId: null | number = null
let user = "Natalie"
let movieId = 3

/**** RENDERING & LISTENING ****/

const reviewsContainer = document.getElementById("reviews-container") as HTMLDivElement
export const reviewStarsSelect = document.getElementById("review-stars-select") as HTMLSelectElement
export const reviewTextarea = document.getElementById("review-textarea") as HTMLTextAreaElement

document.getElementById("save-button")!.addEventListener("click", onSaveReviewClick)

/**
 * Render a list of reviews
 */
function renderReviewList() {
    // Clear out anything from previous renders
    reviewsContainer.innerHTML = ""

    // If there's no reviews, show an empty message
    if (reviewList.length === 0) {
        reviewsContainer.innerHTML = "No reviews yet"
    }

    // For each review, map it to a div, then append that div to the container
    reviewList.map(renderReview).forEach(div => reviewsContainer.appendChild(div))
}

/**
 * Render one review
 */
function renderReview(review: Review) {
  const reviewDiv = document.createElement("div")
  reviewDiv.className = "bg-light mb-3 p-4"
  reviewDiv.innerHTML = `
      <h5>${review.author}</h5>
      <p>${Array(review.stars).fill(null).map(_ => "⭐").join("")}</p>
      <p>${review.text}</p>
      <button id="edit-button" class="btn btn-sm btn-outline-primary">Edit</button>
      <button id="delete-button" class="btn btn-sm btn-outline-danger">Delete</button>
  `
  // Attach the event listener to the edit button that gets the form ready to edit
  reviewDiv.querySelector("#edit-button")!.addEventListener("click", () => {
      reviewToEditId = review.id
      renderReviewForm(review)
  })
  // Attach the event listener to the delete button that deletes the review
  reviewDiv.querySelector("#delete-button")!.addEventListener("click", async () => {
      
      // Delete on the backend first
      await deleteReview(review.id)
      // Delete on the frontend
      const indexToDelete = reviewList.indexOf(review)
      reviewList.splice(indexToDelete, 1)

      renderReviewList()
  })
  return reviewDiv
}


/**
 * When the save button is clicked, either save an edit or a create
 */
async function onSaveReviewClick(event: Event) { 
    event.preventDefault()
    const reviewData = {
        author: user,
        movieId: movieId,
        text: reviewTextarea.value,
        stars: parseInt(reviewStarsSelect.value)
    }

    if(reviewToEditId !== null) {
        // Update on backend
        const reviewToUpdate = {
          ...reviewData,
          id: reviewToEditId
        }
        await putReview(reviewToUpdate)

        // Update on frontend
        const indexToReplace = reviewList.findIndex(r => r.id === reviewToEditId)
        reviewList[indexToReplace] = reviewToUpdate
    } else {
        // Update on backend
        const createdReview = await postReview(reviewData)

        // Update on frontend
        reviewList.push(createdReview)
    }

    renderReviewList()
    reviewToEditId = null
    // Clear the form
    renderReviewForm({ stars: 1, text: "" })
}



/**** START UP ****/

async function startUp() {
    renderReviewList()
    reviewList = await fetchAllReviews()
    renderReviewList()
}

startUp()