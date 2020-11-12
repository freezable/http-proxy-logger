document.addEventListener("DOMContentLoaded", function () {
    const socket = io();
    const messagesElement = document.getElementById('requests')
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);

    const endpointName = urlParams.get('name')
        ? urlParams.get('name')
        : null;

    const endpointElement = document.getElementById(endpointName)
    if (endpointElement) {
        endpointElement.className = 'selected'
    }

    function createBlock(name, data) {
        const nameElement = document.createElement('b');
        nameElement.textContent = name
        const jsonViewer = new JSONViewer();
        const divElement = document.createElement('div');
        divElement.appendChild(nameElement);
        divElement.appendChild(jsonViewer.getContainer());
        jsonViewer.showJSON(data);

        return divElement;
    }

    function createRequestBlock(dump, id) {
        const idElement = document.createElement('p');
        idElement.textContent = id

        let copyUrlBntId = 'copy-' + id
        let buttonText = "Copy request and response to clipboard"
        let clipboardText = JSON.stringify(dump, undefined, 4)

        const divElement = document.createElement('div');
        divElement.id = id;
        divElement.appendChild(idElement);
        divElement.appendChild(createCopyButtonElement(copyUrlBntId, buttonText, clipboardText));
        divElement.appendChild(createBlock('Request', dump.request));
        divElement.appendChild(createBlock('Response', dump.response));

        return divElement
    }

    socket.on(endpointName, function (dump) {
        const id = uuidv4()
        messagesElement.appendChild(createRequestBlock(dump, id))
        messagesElement.appendChild(document.createElement('hr'));
        document.getElementById(id).scrollIntoView();
    });

    socket.on('connect_error', (error) => {
        alert('Connection to monitoring server is closed - please reload this page.')
    });


    Array.from(document.getElementsByClassName('endpoint-link'))
        .forEach(element => {
            let location = ''
            location += window.location.protocol + '//'
            location += window.location.hostname
            if (window.location.port.length > 0) {
                location += ':' + window.location.port
            }

            element.prepend(location)

            let copyUrlBntId = generateRandomString()
            let buttonText = "Copy"
            let clipboardText = element.textContent

            // element.parentElement.appendChild(createCopyButtonElement(copyUrlBntId, buttonText, clipboardText))
        })

    function generateRandomString() {
        return Math
                .random()
                .toString(36)
                .substring(2, 15)
            + Math
                .random()
                .toString(36)
                .substring(2, 15);
    }

    function createCopyButtonElement(copyBntId, buttonText, clipboardText) {
        new ClipboardJS('#' + copyBntId);
        const copyElement = document.createElement('button')
        copyElement.textContent = buttonText
        copyElement.id = copyBntId
        copyElement.dataset.clipboardText = clipboardText

        return copyElement
    }
});
