class entry {
    user;
    text;
    datetime;

    constructor(data){
        this.user = data.user;
        this.text = data.text;
        this.datetime = new Data(data.datetime).toLocaleDateString() 
        + " "+ new Date(data.datetime).toLocaleDateString();
    }
} 

function rederCard(diarys) {
    return `
    <div class="uk-card uk-card-default uk-width-1-2@m gl-container-center" style="margin-bottom: 30px;">
        <div class="uk-card-header">
            <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-auto">
                    <img class="uk-border-circle" width="40" height="40" src="https://i.pravatar.cc/40" alt="Avatar">
                </div>
                <div class="uk-width-expand">
                    <h3 class="uk-card-title uk-margin-remove-bottom">${diarys.user}</h3>
                    <p class="uk-text-meta uk-margin-remove-top"><time>${diarys.datetime}</time></p>
                </div>
            </div>
        </div>
        <div class="uk-card-body">
            <p>${diarys.text}</p>
        </div>
    </div>
    `
}

function displaydiarys(diary) {
    document.getElementById("gl-card-container").innerHTML = null

    diary
        .map(diarys => renderCard(diarys))
        .forEach(diarys => document.getElementById("gl-card-container").innerHTML += diarys)
}
/**
 * Handles the onClick event of the save button when creating a new Glitt. 
 * 
 */
function saveentry() {
    const diarysText = document.getElementById("gl-diarys-text").value;
    const diarysName = document.getElementById("gl-diarys-name").value;
    postentryToBackend(diarysName, diarysText)
}

function resetForm() {
    document.getElementById("gl-diarys-text").value = null;
    document.getElementById("gl-diarys-name").value = null;
}

function hideModal() {
    const modalElement = document.getElementById("gl-create-diarys-modal")
    UIkit.modal(modalElement).hide();
}

function getEntrysFromBackend() {
    fetch("http://localhost:4000/diarys")
        .then(res => res.json())
        .then(json => {
            const diarys = json.map(diarys => new entry(diarys))
            displayEntrys(diary)
        })
}
function postEntrysToBackend(diarysName, diarysText) {
    const fetchConfig = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            user: diarysName,
            text: diarysText,
            datetime: new Date()
        })
    }

    fetch("http://localhost:4000/diary", fetchConfig)
        .then(res => {
            if (res.status === 201) {
                UIkit.notification({
                    message: "Entry confirmed!",
                    status: "success",
                    pos: "bottom-center",
                    timeout: 3_000
                });
                resetForm()
                getEntrysFromBackend()
                hideModal()
            }
        })
}
/// MAIN
getEntrysFromBackend()