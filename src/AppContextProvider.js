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
  //console.log({height});
  //console.log({nodesInLevels});
  //console.log({previousLevelHeights});

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
  //console.log({ nodesInFinalLevels });

  //Map the nodes in each level to the correct format

  const totalGraphHeight = height * 50 + (height - 1) * 70; //number of levels times the height of each node and the spaces between them

  for (let level = 0; level < nodesInFinalLevels.length; level++) {
    nodesInFinalLevels[level] = nodesInFinalLevels[level].map((node) => ({
      id: node.id,
      x: node.anchors[0].from * 110,
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
    x: token.index * 110,
    y: totalGraphHeight + 100,
    label: token.form,
    type: "token",
    group: "token"
  }));

  //this.setState({graphData: nodesInFinalLevels.flat().concat(tokens)});

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

  const finalGraphEdges = graph.edges.map((edge, index) => {
    /*const fromID =
          finalGraphNodes[
              finalGraphNodes.findIndex((node) => node.id === edge.source)
              ].id;
      const toID =
          finalGraphNodes[
              finalGraphNodes.findIndex((node) => node.id === edge.target)
              ].id;*/

    const fromNode = finalGraphNodes.find((node) => node.id === edge.source);
    const toNode = finalGraphNodes.find((node) => node.id === edge.target);

    const fromID = fromNode.id;
    const toID = toNode.id;

    let edgeType = "";

    if (fromNode.nodeLevel === toNode.nodeLevel && fromNode.nodeLevel == 0) {
      edgeType = "curvedCW";
    } else {
      edgeType = "dynamic";
    }

    return {
      id: index,
      from: fromID,
      to: toID,
      label: edge.label,
      smooth: { type: edgeType, roundness: 0.4 },
      endPointOffset: {
        from: 20,
        to: 0
      }
    };
    /*source: testGraphNodes[edge.source],
                  target: testGraphNodes[edge.target],*/
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
