
// $("button").on("click", function(event) {
//   var id = $(this).data("articleid");
//   var saved = true;

//   var articleSaved = {
//       saved: saved
//   };

// // Send the PUT request.
//   $.ajax("/articles/" + id, {
//     type: "PUT",
//     data: articleSaved
//   }).then(
//       function() {
//           console.log("changed saved to", saved);
//           // Reload the page to get the updated list
//           location.reload();
//   });
// });