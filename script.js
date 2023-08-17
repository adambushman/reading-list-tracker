const state = {
    data: [], 
    categories: {
        Basketball: "bi-dribbble", 
        Business: "bi-briefcase", 
        Data: "bi-bar-chart", 
        Biography: "bi-person"
    }
}

function pushList() {
    d3.select("#book-list").selectAll("li")
        .data(state.data)
        .enter()
        .append("li")
        .attr("class", "list-group-item")
        .html((d) => {
            return `
            <div class="card border-0">
                <div class="card-body">
                    <h3 class="card-title position-relative">
                        ${d.title}
                        <span class="ms-3 position-absolute translate-middle">
                            <i class="bi bi-box-arrow-up-right link-icon"></i>
                        </span>
                    </h3>
                    <p class="mb-2 author"><small>&#8212;${d.author}, ${d.year}</small></p>
                    <p>${d.description}</p>
                    <p><small>Started: <span class="fw-bold">${d.date_started}</span> | Finished: <span class="fw-bold">${d.date_finished}</span></small></small></p>
                    <div class="d-flex flex-wrap gap-2">
                        <div class="rounded-pill py-1 px-3 pill-category"><small><i class="bi ${state.categories[d.category]} me-1"></i>
                            <span>${d.category}</span>
                        </small></div>
                        <div class="rounded-pill py-1 px-3 pill-time"><small><i class="bi bi-stopwatch me-1"></i>
                            <span>7</span> days
                        </small></div>
                        <div class="rounded-pill py-1 px-3 pill-pages"><small><i class="bi bi-file-earmark me-1"></i>
                            <span>${d.pages}</span> pages
                        </small></div>
                    </div>
                    <a href="#" class="stretched-link"></a>
                </div>
            </div>
        `})
}

function updateList() {
    console.log(data);
}

d3.csv("reading-list.csv")
    .then((data) => {
        state.data = data;
        pushList();
    })
    .catch((error) => {
        console.error(error);
    });