/**
 * Created by liuliu on 2018/3/13.
 */
import _ from 'lodash';
import printMe from './print';

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    btn.innerHTML = 'click me';

    btn.onclick = printMe;
    element.appendChild(btn);

    return element;
}

document.body.appendChild(component());