import '../prePassMotion.html';
import '../images/icon.svg';
import '../styles/main.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import PrePassMotionAddin from './motion-addin';

geotab.addin.prePassMotion = function() { return new PrePassMotionAddin()};