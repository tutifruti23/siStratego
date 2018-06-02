#include <cmath>
#include <nan.h>
#include <string>
using namespace std;
#include <vector>
#include <algorithm>
bool *arrayCopy(bool *array, int size) {
	bool *newArray;
	newArray = new bool[size];
	for (int i = 0; i < size; i++) {
		newArray[i] = array[i];
	}
	return newArray;
}
std::vector<int> availablesMoves(bool* position, int &size) {
	std::vector<int> freeSquares;;
	for (int i = 0; i < size; i++) {
		if (!position[i]) {
			freeSquares.push_back(i);
		}
	}
	return freeSquares;
}
int eval(bool *postion, int &playerPoints, int &oppPoints) {
	return playerPoints-oppPoints;
}

void makeMove(bool* position, int &playerPoints, int &oppPoints, int move, int size, bool playerTurn) {
	int bok = sqrt(size);
	position[move] = true;

	bool wszystkieZajete = true;
	for (int i = move%bok; i < size; i = i + bok) {
		if (!position[i]) {
			wszystkieZajete = false;
			break;
		}
	}
	if (wszystkieZajete) {
		if (playerTurn) {
			playerPoints += bok;
		}
		else {
			oppPoints += bok;
		}
	}
	wszystkieZajete = true;
	for (int i = (move / bok)*bok; i <(move / bok)*bok+bok; i++) {
		if (!position[i]) {
			wszystkieZajete = false;
			break;
		}
	}
	if (wszystkieZajete) {
		if (playerTurn) {
			playerPoints += bok;
		}
		else {
			oppPoints += bok;
		}
	}
	wszystkieZajete = true;
	int licznik = -1;
	for (int i = move;i>= 0;i=i-bok-1) {
		if (position[i]) {
			licznik++;
		}
		else{
			wszystkieZajete = false;
			break;
		}
		if (i%bok ==0)
			break;
	}
	if (wszystkieZajete) {
		for (int i = move; i<size; i = i + bok + 1) {
			if (position[i]) {
				licznik++;
			}
			else {
				wszystkieZajete = false;
				break;
			}
			if (i%bok == bok - 1)
				break;
		}
	}
	if (wszystkieZajete&&licznik>1) {
		if (playerTurn) {
			playerPoints += licznik;
		}
		else {
			oppPoints += licznik;
		}
	}
	wszystkieZajete = true;
	licznik = -1;
	for (int i = move; i >= 0; i = i - (bok - 1)) {
		if (position[i]) {
			licznik++;
		}
		else {
			wszystkieZajete = false;
			break;
		}
		if (i%bok == bok-1)
			break;
	}
	if (wszystkieZajete) {
		for (int i = move; i<size; i = i + (bok - 1)) {
			if (position[i]) {
				licznik++;
			}
			else {
				wszystkieZajete = false;
				break;
			}
			if (i%bok == 0)
				break;
		}
	}
	if (wszystkieZajete&&licznik>1) {
		if (playerTurn) {
			playerPoints += licznik;
		}
		else {
			oppPoints += licznik;
		}
	}

}
int minMax(bool* position,std::vector<int> &moveList,int playerPoints,int oppPoints,int &boardSize,int moveListSize,int depth,bool maximize ) {
	if (depth == 0||moveListSize==0) {

		return eval(position,playerPoints,oppPoints);
	}
	if(maximize){
		int maxValue =-1000;
		for (int i = 0; i < moveListSize; i++) {
			std::vector<int> temp = moveList;
			bool *tempPos = arrayCopy(position, boardSize);
			int tempPlayerPoints = playerPoints;
			int tempOppPoints = oppPoints;
			makeMove(tempPos,tempPlayerPoints,tempOppPoints,temp[i],boardSize,true);
			temp.erase(temp.begin()+i);
			maxValue = max(maxValue,minMax(tempPos,temp, tempPlayerPoints, tempOppPoints,boardSize,moveListSize-1,depth-1,false));
			delete tempPos;
		}
		return maxValue;
	}
	else {
		int minValue = 1000;
		for (int i = 0; i < moveListSize; i++) {
			std::vector<int> temp = moveList;
			bool *tempPos = arrayCopy(position, boardSize);
			int tempPlayerPoints = playerPoints;
			int tempOppPoints = oppPoints;
			makeMove(tempPos, tempPlayerPoints, tempOppPoints, temp[i],boardSize,false);
			temp.erase(temp.begin() + i);
			minValue = min(minValue, minMax(tempPos, temp,tempPlayerPoints, tempOppPoints, boardSize, moveListSize - 1, depth - 1,true));
			delete tempPos;
		}
		return minValue;
	}
}
int alphaBeta(bool* position, std::vector<int> &moveList, int playerPoints, int oppPoints, int &boardSize, int moveListSize, int depth, bool maximize, int alpha, int beta) {
	if (depth == 0 || moveListSize == 0) {

		return eval(position, playerPoints, oppPoints);
	}
	if (maximize) {
		int maxValue =-1000;
		for (int i = 0; i < moveListSize; i++) {
			std::vector<int> temp = moveList;
			bool *tempPos = arrayCopy(position, boardSize);
			int tempPlayerPoints = playerPoints;
			int tempOppPoints = oppPoints;
			makeMove(tempPos, tempPlayerPoints, tempOppPoints, temp[i], boardSize, true);
			temp.erase(temp.begin() + i);
			maxValue = max(maxValue, alphaBeta(tempPos, temp, tempPlayerPoints, tempOppPoints, boardSize, moveListSize - 1, depth - 1, false,alpha,beta));
			delete tempPos;
			alpha = max(maxValue, alpha);
			if (beta <= alpha)
				break;
		}
		return maxValue;
	}
	else {
		int minValue =1000;
		for (int i = 0; i < moveListSize; i++) {
			std::vector<int> temp = moveList;
			bool *tempPos = arrayCopy(position, boardSize);
			int tempPlayerPoints = playerPoints;
			int tempOppPoints = oppPoints;
			makeMove(tempPos, tempPlayerPoints, tempOppPoints, temp[i], boardSize, false);
			temp.erase(temp.begin() + i);
			minValue = min(minValue, alphaBeta(tempPos, temp, tempPlayerPoints, tempOppPoints, boardSize, moveListSize - 1, depth - 1, true,alpha,beta));
			delete tempPos;
			beta = min(minValue, beta);
			if (beta <= alpha)
				break;
		}
		return minValue;
	}
}
int findBestMove(bool* position, int playerPoints, int oppPoints, int depth,bool playerTurn,int boardSize,bool isMinMax) {
	std::vector<int> moves = availablesMoves(position, boardSize);
	int movesSize = moves.size();
	int bestIndex = -1;

	if (playerTurn) {
		int bestScore =-1000;
		for (int i = 0; i < moves.size(); i++) {
			int moveEval;
			std::vector<int> tempMoves = moves;
			bool *tempPos = arrayCopy(position, boardSize);
			tempMoves.erase(tempMoves.begin() + i);
			int tempPlayerPoints = playerPoints;
			int tempOppPoints = oppPoints;
			makeMove(tempPos,tempPlayerPoints, tempOppPoints, moves[i], boardSize, true);
			if (isMinMax) {
				moveEval = minMax(tempPos, tempMoves, tempPlayerPoints, tempOppPoints, boardSize, movesSize - 1, depth, false);
			}
			else {
				moveEval = alphaBeta(tempPos, tempMoves, tempPlayerPoints, tempOppPoints, boardSize, movesSize - 1, depth, false, -1000,+1000);
			}

			if (moveEval > bestScore) {
				bestScore = moveEval;
				bestIndex = i;
			}
		}

	}
	else {
		int bestScore = 1000;
		for (int i = 0; i < moves.size(); i++) {
			int moveEval;
			std::vector<int> tempMoves = moves;
			bool *tempPos = arrayCopy(position, boardSize);
			tempMoves.erase(tempMoves.begin() + i);
			int tempPlayerPoints = playerPoints;
			int tempOppPoints = oppPoints;
			makeMove(tempPos, tempPlayerPoints, tempOppPoints, moves[i], boardSize,false);
			if (isMinMax) {
				moveEval = minMax(tempPos, tempMoves, tempPlayerPoints, tempOppPoints, boardSize, movesSize - 1, depth, true);
			}
			else {
				moveEval = alphaBeta(tempPos, tempMoves, tempPlayerPoints, tempOppPoints, boardSize, movesSize - 1, depth, true,-1000,1000);
			}
			if (moveEval < bestScore) {
				bestScore = moveEval;
				bestIndex = i;
			}

		}
	}
	return moves[bestIndex];
}
void Pow(const Nan::FunctionCallbackInfo<v8::Value>& info) {

    if (info.Length() < 5) {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }
    /*
    if (!info[0]->IsNumber() || !info[1]->IsNumber()) {
        Nan::ThrowTypeError("Both arguments should be numbers");
        return;
    }
    */
    v8::String::Utf8Value arg0 ( info[0]->ToString());
    std::string pos = std::string(*arg0);
    int size = info[1]->NumberValue();
    size=size*size;
    int pts1=info[2]->NumberValue();
    int pts2=info[3]->NumberValue();
    int depth=info[4]->NumberValue();
    bool *board=new bool[size];
    for(int i=0;i<size;i++){
        if(pos.at(i)=='1')
            board[i]=true;
        else{
            board[i]=false;
        }
    }
    v8::Local<v8::Number> num = Nan::New(findBestMove(board,pts1,pts2,depth,false,size,false));

    info.GetReturnValue().Set(num);
}

void Init(v8::Local<v8::Object> exports) {
    exports->Set(Nan::New("pow").ToLocalChecked(),
                 Nan::New<v8::FunctionTemplate>(Pow)->GetFunction());
}

NODE_MODULE(pow, Init)