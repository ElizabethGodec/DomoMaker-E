
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const color = e.target.querySelector('#domoColor').value;

    if (!name || !age) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, color }, onDomoAdded);
    return false;
};

const handleDeleteDomo = async (id, onDomoDeleted) => {
    const response = await fetch('/deleteDomo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (response.ok) {
        onDomoDeleted();
    } else {
        helper.handleError(result.error || 'Could not delete Domo!');
    }
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="domoMame">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="domoAge">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="domoColor">Color: </label>
            <select id="domoColor" name="color" defaultValue="Blue">
                <option value="Red">Red</option>
                <option value="Orange">Orange</option>
                <option value="Yellow">Yellow</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Purple">Purple</option>
                <option value="Pink">Pink</option>
            </select>
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };

        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoColors = {
        Red: '#FFD6D6',
        Orange: '#FFE2C6',
        Yellow: '#FFF4BF',
        Green: '#D6F5D6',
        Blue: '#D6E9FF',
        Purple: '#E8D6FF',
        Pink: '#FFD6EB',
    };

    const domoNodes = domos.map(domo => (
        <div
            key={domo._id}
            className="domo"
            style={{ backgroundColor: domoColors[domo.color] || domoColors.Blue }}
        >
            <img
                src="/assets/img/domoface.jpeg"
                alt="domo face"
                className="domoFace"
            />
            <h3 className="domoName">Name: {domo.name}</h3>
            <h3 className="domoAge">Age: {domo.age}</h3>
            <h3 className="domoColor">Color: {domo.color || 'Blue'}</h3>

            <button
                type="button"
                className="deleteDomo"
                onClick={() => handleDeleteDomo(domo._id, props.triggerReload)}
            >
                Delete
            </button>
        </div>
    ));

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList
                    domos={[]}
                    reloadDomos={reloadDomos}
                    triggerReload={() => setReloadDomos(prev => !prev)}
                />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
