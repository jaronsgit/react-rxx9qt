import React, { useReducer } from "react";
import { dmrsData } from "./store.js";
export const AppContext = React.createContext();

export const layoutGraph = (sentence) => {
    let graph = sentence;

    //Determine span lengths of each node
    const graphNodeSpanLengths = graph.nodes
        .map((node) => node.anchors[0])
        .map((span) => span.end - span.from);
    //Determine unique span lengths of all the node spans
    let uniqueSpanLengths = [];
    const map = new Map();
    for (const item of graphNodeSpanLengths) {
        if (!map.has(item)) {
            map.set(item, true); // set any value to Map
            uniqueSpanLengths.push(item);
        }
    }
    uniqueSpanLengths.sort((a, b) => a - b); //sort unique spans ascending

    //Sort the nodes into each level based on their spans
    let nodesInLevels = [];
    for (const level of uniqueSpanLengths) {
        let currentLevel = [];

        for (
            let spanIndex = 0;
            spanIndex < graphNodeSpanLengths.length;
            spanIndex++
        ) {
            if (graphNodeSpanLengths[spanIndex] === level) {
                currentLevel.push(graph.nodes[spanIndex]);
            }
        }

        nodesInLevels.push(currentLevel);
    }
    //Find the nodes in each level with the same span and group them together
    //Find the unique spans in each level
    let uniqueSpansInLevels = [];
    for (let level of nodesInLevels) {
        let uniqueSpans = []; //Stores the "stringified" objects
        const spanMap = new Map();
        for (const node of level) {
            if (!spanMap.has(JSON.stringify(node.anchors))) {
                spanMap.set(JSON.stringify(node.anchors), true); // set any value to Map
                uniqueSpans.push(JSON.stringify(node.anchors));
            }
        }
        uniqueSpansInLevels.push(uniqueSpans);
        //console.log(uniqueSpans);
    }

    //Iterate through the unique spans in each level and group the same ones together
    for (let level = 0; level < nodesInLevels.length; level++) {
        let newLevelOfGroups = [];
        for (let uniqueSpan of uniqueSpansInLevels[level]) {
            //find the nodes in the level that have the same span and group them together
            let nodesWithCurrentSpan = nodesInLevels[level].filter(
                (node) => JSON.stringify(node.anchors) === uniqueSpan
            );
            newLevelOfGroups.push(nodesWithCurrentSpan);
        }
        nodesInLevels[level] = newLevelOfGroups;
    }
    //Determine the actual number of levels needed
    let height = 0;
    let previousLevelHeights = [0];
    for (let level of nodesInLevels) {
        let maxLevelHeight = 0;
        for (let item of level) {
            maxLevelHeight = Math.max(maxLevelHeight, item.length);
        }
        previousLevelHeights.push(maxLevelHeight);
        height += maxLevelHeight;
    }

    //Sort the nodes into the final levels
    let nodesInFinalLevels = [];
    for (let index = 0; index < height; index++) {
        nodesInFinalLevels.push([]);
    }
    for (let level = 0; level < nodesInLevels.length; level++) {
        //console.log(nodesInLevels[level]);
        for (let group of nodesInLevels[level]) {
            //console.log({group});
            for (
                let nodeGroupIndex = 0;
                nodeGroupIndex < group.length;
                nodeGroupIndex++
            ) {
                //console.log(group[nodeGroupIndex]);
                let finalLevel =
                    previousLevelHeights
                        .slice(0, level + 1)
                        .reduce((accumulator, currentValue) => accumulator + currentValue) +
                    nodeGroupIndex;
                nodesInFinalLevels[finalLevel].push(group[nodeGroupIndex]);
            }
        }
    }

    //Map the nodes in each level to the correct format
    const totalGraphHeight = height * 50 + (height - 1) * 70; //number of levels times the height of each node and the spaces between them
    let space = 130;

    for (let level = 0; level < nodesInFinalLevels.length; level++) {
        nodesInFinalLevels[level] = nodesInFinalLevels[level].map((node) => ({
            id: node.id,
            x: node.anchors[0].from * space,
            y: totalGraphHeight - level * (totalGraphHeight / height),
            label: node.label,
            type: "node",
            nodeLevel: level,
            anchors: node.anchors[0],
            group: "node"
        }));
    }

    const tokens = graph.tokens.map((token) => ({
        index: token.index,
        x: token.index * space,
        y: totalGraphHeight + 200,
        label: token.form,
        type: "token",
        group: "token"
    }));

    const finalGraphNodes = nodesInFinalLevels
        .flat()
        .concat(tokens)
        .map((node) => ({
            id: node.id,
            x: node.x,
            y: node.y,
            label: node.label,
            title: node.label + " tooltip text",
            group: node.group,
            anchors: node.anchors,
            fixed: true,
            nodeLevel: node.nodeLevel
        }));

    //Setting directed node neighbours for better edge placement
    //let directedNeighbours = [];
    let directedNeighbours = new Map();

    for(let node of graph.nodes){
        directedNeighbours[node.id] = [];
    }

    /*for (let i = 0; i < graph.nodes.length; i++) {
        directedNeighbours[i] = [];
    }*/

    for (let e of graph.edges) {
        //console.log(e);
        if(directedNeighbours.has(e.source)) {
            directedNeighbours[e.source].push(e.target);
        }
    }

    const finalGraphEdges = graph.edges.map((edge, index) => {
        const fromNode = finalGraphNodes.find((node) => node.id === edge.source);
        const toNode = finalGraphNodes.find((node) => node.id === edge.target);

        const fromID = fromNode.id;
        const toID = toNode.id;

        let edgeType = "";
        let round = 0.45;
        if (fromNode.x === toNode.x) {
            if (Math.abs(fromNode.nodeLevel - toNode.nodeLevel) === 1) {
                edgeType = "continuous";
            } else {
                edgeType = "curvedCCW";
                for (let i = 0; i < directedNeighbours[fromID].length; i++) {
                    if (
                        fromNode.x / space -
                        graph.nodes[directedNeighbours[fromID][i]].anchors[0].from ===
                        1
                    ) {
                        edgeType = "curvedCW";
                    }
                }
            }
        } else {
            if (fromNode.nodeLevel === toNode.nodeLevel) {
                edgeType = "curvedCCW";
                if (Math.abs(fromNode.x / space - toNode.x / space) > 4) {
                    round = 0.2;
                }
                if (Math.abs(fromNode.x / space - toNode.x / space) > 10) {
                    round = 0.1;
                }
                if (
                    fromNode.x / space - toNode.x / space > 0 &&
                    fromNode.nodeLevel === 0
                ) {
                    edgeType = "curvedCW";
                }
            } else {
                edgeType = "dynamic";
            }
        }

        return {
            id: index,
            from: fromID,
            to: toID,
            label: edge.label,
            smooth: { type: edgeType, roundness: round },
            endPointOffset: {
                from: 20,
                to: 0
            }
        };

    });

    const finalGraph = {
        nodes: finalGraphNodes,
        edges: finalGraphEdges
    };

    return finalGraph;
};

const initialState = {
  dataSet: dmrsData,
  dataSetFileName: null,
  selectedSentenceVisualisation: layoutGraph(dmrsData[0]),
  selectedSentenceID: dmrsData[0].id,
  selectedNodeAndEdges: null,
  isLoading: false,
  APIendpoint: "http://localhost:8080",
  testResults: {
    LongestPathUndirected: [
      [20, 17, 19, 21, 22, 10, 2, 8, 6, 5, 4],
      [20, 17, 19, 21, 22, 10, 2, 8, 6, 5, 7]
    ],
    Connected: true,
    Planar: true,
    LongestPathDirected: [
      [6, 8, 2],
      [13, 10, 2],
      [13, 10, 12],
      [22, 10, 2],
      [22, 10, 12]
    ]
  },
  longestPathVisualisation: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATASET":
      return { ...state, dataSet: action.payload.dataSet };
    case "SET_DATASET_FILENAME":
      return { ...state, dataSetFileName: action.payload.dataSetFileName };
    case "SET_SENTENCE_VISUALISATION":
      return {
        ...state,
        selectedSentenceVisualisation: layoutGraph(
          state.dataSet.find(
            (sentence) => sentence.id === action.payload.selectedSentenceID
          )
        )
      };
    case "SET_LONGEST_VISUALISATION":
      return {
        ...state,
        longestPathVisualisation: action.payload.longestPathVisualisation
      };
    case "SET_SELECTED_SENTENCE_ID":
      return {
        ...state,
        selectedSentenceID: action.payload.selectedSentenceID
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload.isLoading };
    case "SET_SELECT_NODE_EDGE":
      return {
        ...state,
        selectedNodeAndEdges: action.payload.selectedNodeAndEdges
      };
    case "SET_TEST_RESULTS":
      return { ...state, testResults: action.payload.testResults };
    default:
      break;
  }
};

export default function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
/*
export class AppProvider extends Component {
  componentDidMount = () => {
    const initState = {
      dataSet: {},
      selectedSentence: {},
      isLoading: false,
      dispatch: (action) => {
        this.setState((state) => reducer(state, action));
      }
    };
    this.setState(initState);
  };

  state = {};

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}*/
