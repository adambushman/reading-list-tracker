const state = {
    data: [], 
    categories: {
        Basketball: "bi-dribbble", 
        Professional: "bi-briefcase", 
        Data: "bi-bar-chart", 
        Biography: "bi-person", 
        Finance: "bi-piggy-bank", 
        Classic: "bi-book", 
    }
}

const formatTime = d3.timeFormat("%B %d, %Y");

function pushList() {
    d3.select("#book-list").selectAll("li")
        .data(state.data)
        .enter()
        .append("li")
        .attr("class", "list-group-item")
        .html((d) => {
            let date_finished = d.date_finished == 'Invalid Date' ? '' : formatTime(d.date_finished);
            let days_to_finish = isNaN(d.days_to_finish) ? '...' : Math.round(d.days_to_finish) + ' days';
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
                    <p><small>Started: <span class="fw-bold">${formatTime(d.date_started)}</span> | Finished: <span class="fw-bold">${date_finished}</span></small></small></p>
                    <div class="d-flex flex-wrap gap-2">
                        <div class="rounded-pill py-1 px-3 pill-category"><small><i class="bi ${state.categories[d.category]} me-1"></i>
                            <span>${d.category}</span>
                        </small></div>
                        <div class="rounded-pill py-1 px-3 pill-time"><small><i class="bi bi-stopwatch me-1"></i>
                            <span>${days_to_finish}</span>
                        </small></div>
                        <div class="rounded-pill py-1 px-3 pill-pages"><small><i class="bi bi-file-earmark me-1"></i>
                            <span>${d.pages}</span> pages
                        </small></div>
                    </div>
                    <a href="#" onclick="openModal(${d.id})" class="stretched-link"></a>
                </div>
            </div>
        `})
}

function openModal(id) {
    let target_data = aq.from(state.data)
        .filter(aq.escape(d => d.id == id))
        .objects()[0];

    console.log(target_data);

    let modal_toggle = new bootstrap.Modal(document.getElementById('details-modal'));
    let modal = d3.select("#details-modal");

    modal.select("#modal-title").text(target_data.title);
    modal.select(".modal-author").text(`${target_data.author}, ${target_data.year}`);

    modal.select("#takeaway-list").selectAll("li").remove();
    let takeaways = target_data.takeaways;
    if(takeaways.length == 0) {
        modal.select("#takeaway-list")
            .append("li")
            .text("Takeaways coming soon")
    } else {
        modal.select("#takeaway-list")
            .selectAll("li")
            .data(takeaways)
            .enter()
            .append("li")
            .text((d) => d);
    }

    modal.select("#img").selectAll('img').remove();
    modal.select("#img")
        .append("img")
        .attr("class", "img-fluid rounded")
    .attr("src", `book-images/${target_data.image}`)

    modal_toggle.toggle();
}

function pushNav() {
    let years = ["Year"].concat([...new Set(d3.map(state.data, d => { return d.year_started; }))]);
    let categories = ["Category"].concat([...new Set(d3.map(state.data, d => { return d.category; }))]);

    d3.select("#year-nav").selectAll("li")
        .data(years)
        .enter()
        .append("li")
        .attr("class", (d,i) => {return i == 0 ? "list-group-item active" : "list-group-item"; })
        .html((d,i) => { 
            return i == 0 ? d : `<a class="nav-link" href="#" onclick="updateList('${d}')">${d}</a>`;
        });

    d3.select("#category-nav").selectAll("li")
        .data(categories)
        .enter()
        .append("li")
        .attr("class", (d,i) => {return i == 0 ? "list-group-item list-group-item-action active" : "list-group-item"; })
        .html((d,i) => { 
            return i == 0 ? d : `<a class="nav-link" href="#" onclick="updateList('${d}')">${d}</a>`;
        });
}

function updateList(item) {
    console.log(item, state.data);
    let new_data = state.data;
    if(item != 'All') {
        new_data = aq.from(state.data)
            .filter(aq.escape(d => item.includes(d.year_started) | item.includes(d.category)))
            .objects()
    }

    console.log(new_data);

    d3.select("#book-list").selectAll('li').remove();

    d3.select("#book-list").selectAll("li")
        .data(new_data)
        .enter()
        .append("li")
        .attr("class", "list-group-item")
        .html((d) => {
            let date_finished = d.date_finished == 'Invalid Date' ? '' : formatTime(d.date_finished);
            let days_to_finish = isNaN(d.days_to_finish) ? '...' : Math.round(d.days_to_finish) + ' days';
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
                    <p><small>Started: <span class="fw-bold">${formatTime(d.date_started)}</span> | Finished: <span class="fw-bold">${date_finished}</span></small></small></p>
                    <div class="d-flex flex-wrap gap-2">
                        <div class="rounded-pill py-1 px-3 pill-category"><small><i class="bi ${state.categories[d.category]} me-1"></i>
                            <span>${d.category}</span>
                        </small></div>
                        <div class="rounded-pill py-1 px-3 pill-time"><small><i class="bi bi-stopwatch me-1"></i>
                            <span>${days_to_finish}</span>
                        </small></div>
                        <div class="rounded-pill py-1 px-3 pill-pages"><small><i class="bi bi-file-earmark me-1"></i>
                            <span>${d.pages}</span> pages
                        </small></div>
                    </div>
                    <a href="#" onclick="openModal(${d.id})" class="stretched-link"></a>
                </div>
            </div>
        `});
}

d3.json("reading-list.json")
    .then((data) => {
        console.log(data);
        state.data = aq.from(data)
            .derive({id: d => op.row_number()})
            .derive({
                date_started: aq.escape(d => new Date(d.date_started)),
                date_finished: aq.escape(d => new Date(d.date_finished))
            })
            .derive({
                days_to_finish: d => (d.date_finished - d.date_started) / (1000 * 60 * 60 * 24) // Days
            })
            .derive({ year_started: aq.escape(d => d.date_started.getFullYear()) })
            .objects();
        console.log(state.data);
        pushNav();
        pushList();
    })
    .catch((error) => {
        console.error(error);
    });