import React, { Component, CSSProperties } from 'react';
import { IClaim } from '../../models/claim';
import { createDocument } from '../PDFLink/Document';
import { PDFLink, PDFDownloadLinkRenderProps } from '../PDFLink';
import { DocumentProps } from '../PDFLink/Document/DocumentModels';
import { Colors, Styles, blueGradientBgImg } from '../../constants/style';
import { TaskButton, TaskButtonProps, ToggleClassname } from './TaskButton';
import AriaModal from 'react-aria-modal';

/**
 * Properties for DownloadModal
 * @export
 * @interface DownloadModalProps
 */
export interface DownloadModalProps {
  claim: IClaim;
  isOpen: boolean;
  closeFromParent: () => void;
}
/**
 * State for DownloadModal
 * @export
 * @interface DownloadModalProps
 */
export interface DownloadModalState {
  showModal: boolean;
  showHide: string;
  showMultiSelect: string;
  taskButtonProps: TaskButtonProps[];
  selectedList: string[];
  submitDownloadProps: DocumentProps;
  downLoadContinued: boolean;
  submitDownload: boolean;
  isDisabled: boolean;
}

// tslint:disable-next-line:no-unsafe-any

/**
 * Renders a Modal window to download a document's targets
 * @export
 * @class {DownloadModal}
 * @param {DownloadModalProps} item
 */
export class DownloadModal extends Component<DownloadModalProps, DownloadModalState> {
  constructor(props: DownloadModalProps) {
    super(props);
    this.state = {
      isDisabled: false,
      showModal: props.isOpen,
      showHide: 'hidden',
      showMultiSelect: '',
      taskButtonProps: this.generateButtons(props),
      selectedList: [],
      submitDownloadProps: {
        claim: this.props.claim,
        taskModels: [],
        renderOverview: false,
        renderEntireTarget: false
      },
      submitDownload: false,
      downLoadContinued: false
    };
  }
  /**
   * Handles the user clicking the Confirm Button
   *
   * To Do: Link result to PDF generation/download
   */

  handleConfirm = () => {
    this.setState({
      submitDownloadProps: {
        claim: this.props.claim,
        taskModels: this.props.claim.target[0].taskModels.filter(t =>
          this.state.selectedList.includes(t.taskName)
        ),
        renderOverview: this.state.selectedList.includes('Overview'),
        renderEntireTarget: this.state.selectedList.includes('Entire Target')
      },
      submitDownload: true,
      isDisabled: true
    });
  };

  /**
   * Handles the user clicking the Continue Button
   *
   * Toggles hidden selections page and makes an unordered list of selected buttons
   */

  handleContinue = () => {
    const taskButtons = this.state.taskButtonProps;
    const selectList: string[] = this.createSelectionList(taskButtons);
    this.setState({
      showMultiSelect: 'hidden',
      showHide: '',
      selectedList: selectList,
      downLoadContinued: true
    });
  };

  /**
   * Generates a list of <li> elements containing all selected taskModels
   *
   */
  createSelectionList = (taskButtons: TaskButtonProps[]) => {
    return taskButtons.filter(task => task.toggled).map(t => t.taskName);
  };

  /**
   * Handles the user clicking the Back Button on the confirm selection screen
   *
   * Toggles hidden selections page and clears the list of selected buttons
   */
  handleBackButton = () => {
    this.setState({
      showMultiSelect: '',
      showHide: 'hidden',
      selectedList: [],
      isDisabled: false,
      submitDownload: false
    });
  };

  /**
   * Toggles a selected button and handles multi-select/all-select logic
   *
   * This function is passed to the child Taskbutton objects as a prop to call onClick
   */
  toggleButton = (taskName: string) => {
    const taskButtons = this.state.taskButtonProps;
    if (taskName === 'Entire Target') {
      this.toggleEntireTarget(taskButtons);
    } else {
      const { toggledButton, idx } = this.getToggled(taskButtons, taskName);
      if (toggledButton !== undefined) {
        this.toggleSelection(taskButtons, toggledButton, idx);
      }
    }
  };
  /**
   * Sets the toggled boolean and checked/unchecked classname for Taskbutton objects
   *
   * This function will untoggle the Entire Target button when setting a single Taskbutton
   */
  toggleSelection(taskButtons: TaskButtonProps[], toggledButton: TaskButtonProps, idx: number) {
    taskButtons[0].toggled = false;
    taskButtons[0].cName = ToggleClassname.Unchecked;
    toggledButton.toggled = !toggledButton.toggled;
    toggledButton.cName =
      toggledButton.cName === ToggleClassname.Unchecked
        ? ToggleClassname.Checked
        : ToggleClassname.Unchecked;
    taskButtons[idx] = toggledButton;
    let togglecount = 0;
    taskButtons.forEach(task => {
      if (task.toggled) togglecount++;
    });
    if (togglecount === 0) {
      taskButtons[0].toggled = true;
      taskButtons[0].cName = ToggleClassname.Checked;
    }
    this.setState({ taskButtonProps: taskButtons, selectedList: [] });
  }
  /**
   * Returns the object and index for whichever button was clicked/toggled
   *
   */
  getToggled(taskButtons: TaskButtonProps[], taskName: string) {
    const toggledButton = taskButtons.find(task => {
      return task.taskName === taskName;
    });
    const idx = taskButtons.findIndex(task => {
      return task.taskName === taskName;
    });

    return { toggledButton, idx };
  }
  /**
   * Toggles the EntireTarget taskbutton while untoggling all others
   *
   */
  toggleEntireTarget(taskButtons: TaskButtonProps[]) {
    taskButtons.forEach(task => {
      task.toggled = false;
      task.cName = ToggleClassname.Unchecked;
    });
    taskButtons[0].toggled = true;
    taskButtons[0].cName = ToggleClassname.Checked;
    this.setState({ taskButtonProps: taskButtons, selectedList: [] });
  }
  /**
   * Creates an array of JSX Elements containing TaskButtons to pass to the state
   *
   */
  generateButtons(props: DownloadModalProps): TaskButtonProps[] {
    const taskArray: TaskButtonProps[] = [];
    const models: string[] = [];
    props.claim.target[0].taskModels.forEach(tm => models.push(tm.taskName));
    this.generateDefaultButtons(taskArray);
    if (props.claim) {
      const taskModels = models.sort((a, b) => {
        return (
          parseInt(a.replace('Task Model ', ''), 10) - parseInt(b.replace('Task Model ', ''), 10)
        );
      });
      for (const task of taskModels) {
        this.generateTaskButtons(taskArray, task);
      }
    }

    return taskArray;
  }
  /**
   * Takes all Task Models passed in from props and creates corresponding TaskButtons, adding them into an array of JSX Elements
   *
   */
  generateTaskButtons(taskArray: TaskButtonProps[], task: string) {
    taskArray.push({
      toggled: false,
      cName: ToggleClassname.Unchecked,
      id: task.replace(' ', '-').toLowerCase(),
      taskName: task,
      toggleParent: this.toggleButton
    });
  }
  /**
   * Creates the 2 default "Entire Target" and "Overview" TaskButtons;
   *
   */
  generateDefaultButtons(taskArray: TaskButtonProps[]) {
    taskArray.push({
      toggled: true,
      cName: ToggleClassname.Checked,
      id: 'entire-target',
      taskName: 'Entire Target',
      toggleParent: this.toggleButton
    });
    const overview = {
      toggled: false,
      cName: ToggleClassname.Unchecked,
      id: 'overview',
      key: 'overview',
      taskName: 'Overview',
      toggleParent: this.toggleButton
    };
    taskArray.push(overview);
  }
  renderTaskButtons = (taskButtons: TaskButtonProps[]) => {
    return taskButtons.map((b, i) => <TaskButton {...b} key={i} />);
  };
  modalForm(taskButtons: TaskButtonProps[]): JSX.Element {
    return (
      <form className={this.state.showMultiSelect} id="modal-form">
        <div id="title-container">Download PDF</div>
        <div id="entire-target-btn-container">
          {<TaskButton {...this.state.taskButtonProps[0]} />}
        </div>
        <div id="scrollable-btn-container">
          <div id="task-models-container">{this.renderTaskButtons(taskButtons)}</div>
        </div>
        <div id="submit-btn-container">
          <button type="button" onClick={this.handleContinue} id="continue-btn">
            Continue
          </button>
        </div>
        <style jsx>{`
          button {
            display: flex;
            flex-direction: column;
            width: 225px;
            margin-left: 15px;
            margin-right: 10px;
            height: 40px;
            text-align: center;
            text-align: -webkit-center;
            border: solid;
            line-height: 30px;
            border-color: ${Colors.sbGray};
            border-radius: 4px;
            background-color: #fff;
            font-family: ${Styles.sbSans};
            font-size: 16px;
            color: ${Colors.sbGrayDarker};
            letter-spacing: ${Styles.sbLetterSpacing};
          }
          .checked {
            background-image: ${blueGradientBgImg.backgroundImage};
            color: ${Colors.sbGrayLighter};
          }
          #entire-target-btn {
            margin-bottom: 12px;
          }
          #continue-btn {
            margin-top: 50px;
            margin-left: 40px;
            border: none;
            height: 30px;
            line-height: 26px;
            width: 175px;
            background-image: ${blueGradientBgImg.backgroundImage};
            color: ${Colors.sbGrayLighter};
          }
          #scrollable-btn-container {
            overflow-y: scroll;
            margin-right: -15px;
            height: 200px;
          }
          #title-container {
            text-align: center;
            font-family: ${Styles.sbSans};
            font-size: 18px;
            font-weight: bold;
            color: ${Colors.sbGray};
            letter-spacing: ${Styles.sbLetterSpacing};
            margin-bottom: 5px;
            margin-top: -10px;
          }
          .hidden {
            display: none;
          }
        `}</style>
      </form>
    );
  }
  renderSelectionsList = () => {
    const result: JSX.Element[] = [];
    this.state.selectedList.forEach(task => {
      result.push(
        <li key={task} aria-label={task}>
          <style jsx>{`
            li {
              margin-bottom: 10px;
            }
          `}</style>
          {task}
        </li>
      );
    });

    return result;
  };

  confirmSelection() {
    const pdfDownLoadProps: PDFDownloadLinkRenderProps = {
      document: createDocument({ ...this.state.submitDownloadProps }),
      fileName: `${this.state.submitDownloadProps.claim.target[0].title}.pdf`
    };

    return (
      <div id="confirm-selections" className={this.state.showHide}>
        <div id="selections-title" tabIndex={0}>
          Selected Sections
        </div>
        <div id="selections-list" tabIndex={0}>
          <ul>{this.renderSelectionsList()}</ul>
        </div>
        {this.state.submitDownload && <PDFLink {...pdfDownLoadProps} />}
        <div id="confirm-back-btn-container">
          <button type="button" id="back-btn" onClick={this.handleBackButton}>
            Back
          </button>
          <button
            type="button"
            id="confirm-btn"
            onClick={this.handleConfirm}
            disabled={this.state.isDisabled}
          >
            Confirm
          </button>
        </div>
        <style jsx>{`
          button {
            display: flex;
            flex-direction: column;
            width: 225px;
            margin-left: 15px;
            margin-right: 10px;
            height: 40px;
            text-align: center;
            text-align: -webkit-center;
            border: solid;
            cursor: pointer;
            line-height: 30px;
            border-color: ${Colors.sbGray};
            border-radius: 4px;
            background-color: #fff;
            font-family: ${Styles.sbSans};
            font-size: 16px;
            color: ${Colors.sbGrayDarker};
            letter-spacing: ${Styles.sbLetterSpacing};
          }
          .hidden {
            display: none;
          }
          div {
            font-family: ${Styles.sbSans};
            text-align: center;
            letter-spacing: ${Styles.sbLetterSpacing};
            color: ${Colors.sbGray};
          }
          #selections-title {
            font-size: 20px;
            font-weight: bold;
            margin-right: 35px;
            margin-left: 35px;
            margin-bottom: 5px;
            margin-top: -10px;
          }
          #selections-list {
            overflow-y: auto;
            height: 200px;
            margin-left: -20px;
            text-align: left;
            font-size: 16px;
          }
          #pdf-page-count {
            font-size: 14px;
          }
          #confirm-back-btn-container button {
            width: 100px;
            background-image: ${blueGradientBgImg.backgroundImage};
            margin-top: 10px;
            display: inline-block;
            color: ${Colors.sbGrayLighter};
          }
          #confirm-back-btn-container button :disabled {
            background-image: none;
            background-color: ${Colors.sbGray};
            cursor: default;
          }
        `}</style>
      </div>
    );
  }

  setAppElement = () => {
    return document.getElementById('body') as HTMLElement;
  };
  closing = () => {
    this.props.closeFromParent();
  };
  render() {
    const taskButtons = this.state.taskButtonProps.slice(1);

    return (
      <div>
        {/* tslint:disable-next-line:no-unsafe-any */}
        <AriaModal
          titleText="Download PDF"
          mounted={this.props.isOpen}
          onExit={this.closing}
          getApplicationNode={this.setAppElement}
          underlayClickExits={true}
          verticallyCenter={true}
          dialogStyle={{ backgroundColor: '#FFF', borderRadius: '5px', padding: '20px' }}
        >
          {this.modalForm(taskButtons)}
          {/* tslint:disable-next-line:no-unsafe-any */}
          {this.confirmSelection()}
          {/* tslint:disable-next-line:no-unsafe-any */}
        </AriaModal>
      </div>
    );
  }
}
